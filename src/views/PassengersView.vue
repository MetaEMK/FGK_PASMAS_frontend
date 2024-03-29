<script setup lang="ts">
import ContentHeader from "@/components/ContentHeader.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import type { Passenger } from "@/data/passenger/passenger.interface";
import { getPassengers, getPassengersStream } from "@/data/passenger/passenger.service";
import { ErrorToast } from "@/utils/toasts/error.toast";
import { InfoToast } from "@/utils/toasts/info.toast";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, onUnmounted, ref } from "vue";

const toast = useToast();

const passengers = ref<Passenger[]>([]);

let eventSource: EventSource;

const columns = [
    {
        field: "ID",
        header: "ID",
    },
    {
        field: "LastName",
        header: "Nachname",
    },
    {
        field: "FirstName",
        header: "Vorname",
    },
    {
        field: "Weight",
        header: "Gewicht (kg)",
    },
    {
        field: "CreatedAt",
        header: "Erstellt am",
    },
    {
        field: "UpdatedAt",
        header: "Aktualisiert am",
    },
];

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ID: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FirstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Weight: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CreatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    UpdatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onBeforeMount(async () => {
    passengers.value = await useValidateAPIData(getPassengers(), toast);
    
    eventSource = getPassengersStream();

    eventSource.onopen = async () => {
        passengers.value = await useValidateAPIData(getPassengers(), toast);
    }

    eventSource.onmessage = (event) => {
        handleOnMessageEvent(event);
    }

    eventSource.onerror = () => {
        toast.add(new ErrorToast({ 
            summary: "Verbindung zum Server verloren", 
            detail: "Es wird versucht eine Verbindung herzustellen...",
            life: 5000
        }));
    }
});

onUnmounted(() => {
    if (eventSource) {
        eventSource.close();
    }
});

function handleOnMessageEvent(event: MessageEvent): void
{
    const json = JSON.parse(event.data);
    const action: string = json.action;
    const passengerData: Passenger = json.data;
    
    switch(action) {
        case "CREATED":
            passengers.value.push(passengerData);
            
            toast.add(new InfoToast({ detail: "Passagier " + passengerData.LastName + ", " + passengerData.FirstName + " wurde angelegt." }));

            break;
        case "DELETED":
            passengers.value = passengers.value.filter((passenger) => {
                return passenger.ID !== passengerData.ID;
            });

            toast.add(new InfoToast({ detail: "Passagier " + passengerData.LastName + ", " + passengerData.FirstName + " wurde gelöscht." }));

            break;
    }
}
</script>

<template>
    <main>
        <ContentHeader title="Passagiere" />
        <div>
            <PrimeDataTable 
                v-model:filters="filters" 
                :value="passengers"
                filterDisplay="row"
                sortMode="multiple"
                removableSort
                stripedRows
            >
                <template #header>
                    <div class="flex justify-content-end">
                        <span class="p-input-icon-left">
                            <i class="bi-search" />
                            <PrimeInputText v-model="filters['global'].value" placeholder="Suche..." />
                        </span>
                    </div>
                </template>
                <template #empty> Keine Passagiere gefunden. </template>
                <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText class="filter-input p-column-filter" v-model="filterModel.value" type="text" @input="filterCallback()" />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
        </div>
    </main>
</template>

<style scoped lang="scss">
// ToDo Fixed table headers / Show table headers when scrolling up
.filter-input {
    min-width: 75px;
}
</style>
