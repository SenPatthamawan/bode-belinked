<template>
    <v-card>
                    <div class="d-flex flex-column p-3">
                        <div>
                            <v-btn :disabled="isDisabled" icon :class="`${isDisabled ? 'btn-delete-disabled': 'btn-delete'}`" size="x-small" @click="removeWork(queueItem)">
                                <v-icon :color="`${isDisabled ? 'unset' : 'white' }`">mdi-delete</v-icon>
                            </v-btn>
                        </div>
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <div class="d-flex flex-row align-items-center">
                                <div class="mr-4">
                                    <v-icon size="70" color="#000000">mdi-cat</v-icon>
                                </div>
                                <div>
                                    <span class="text-queue">{{queueItem.storeFrontQueue}}</span>
                                </div>
                            </div>
                            <div>
                                <v-btn dark :class="`rounded-btn justify-content-center align-items-center ${ queueItem.statusQueue === 'confirmjob' || isDisabled  ? 'rounded-btn-confirm':'rounded-btn-closejob'}`
                            " @click="callQueue(queueItem)" :disabled="queueItem.statusQueue === 'confirmjob'">
                                    <div class="d-flex flex-column">
                                        <div><v-icon size="25">mdi-bell-ring</v-icon></div>
                                        <div>
                                            <span class="text-white text-event">เรียกคิว</span>
                                        </div>
                                    </div>
                                </v-btn>
                            </div>
                        </div>
                        <div class="d-flex flex-row justify-content-between align-items-center mt-4">
                            <div class="w-100 mr-1">
                                <v-btn class="btn-event w-100 px-1" color="success" rounded :disabled="queueItem.statusQueue !== 'confirmjob'"
                                @click="returnQueue(queueItem)"
                                    elevation="1"><v-icon>mdi-clipboard-arrow-down-outline</v-icon><span
                                        :class="`${queueItem.statusQueue === 'waiting' ? '' : 'text-white' } mx-1 text-sub-event`">คืนคิว</span></v-btn>
                            </div>
                            <div class="w-100 mr-1">
                                <v-btn class="btn-event w-100 px-1" rounded color="#1B437C"
                                @click="callQueueAgain(queueItem)"
                                :disabled="queueItem.statusQueue !== 'confirmjob'"><v-icon
                                        class="text-white">mdi-refresh</v-icon><span
                                        :class="`${queueItem.statusQueue === 'waiting' ? '' : 'text-white'} text-sub-event`">เรียกคิวซ้ำ</span></v-btn>
                            </div>
                            <div class="w-100">
                                <v-btn class="btn-event w-100 px-1" rounded color="#F38383"
                                @click="closingWork(queueItem)"
                                :disabled="queueItem.statusQueue === 'confirmjob' ? false : true"><v-icon
                                class="text-white">mdi-check-circle-outline</v-icon>
                                    <span :class="`${queueItem.statusQueue  === 'waiting' ? '' : 'text-white'} text-sub-event`">ปิดงาน</span></v-btn>
                            </div>
                        </div>
                    </div>
                </v-card>
</template>
<script>
export default {
  name: 'CardQueueBooking',
  props: {
    isDisabled: {type: Boolean, default: false},
    queueItem: { type: Object, default: () => {} },
    status: { type: String, default: '' },
    closingWork: {type: Function, default: () => {}},
    removeWork: {type: Function, default: () => {}},
    callQueue: {type: Function, default: () => {}},
    callQueueAgain: {type: Function, default: () => {}},
    returnQueue: {type: Function, default: () => {}}
  }
}
</script>
<style scoped>
.rounded-btn-confirm {
    background: linear-gradient(#dadada, #a1a1a1) padding-box,
        linear-gradient(to right, #dadada, #a1a1a1) border-box;
}

.rounded-btn-closejob {
    background: linear-gradient(#25d366, #23b091) padding-box,
        linear-gradient(to right, #25d366, #23b091) border-box;
}

.rounded-btn {
    color: white;
    padding: 10px 20px;
    /* Adjust padding as needed */
    border: none;
    cursor: pointer;
    /* font-size: 40px; */
    border-radius: 50em;
    width: 80px !important;
    height: 80px !important;
    box-sizing: border-box;
    border: 6px solid transparent;
}

.text-bell {
    width: 100px !important;
}

.text-bell-disabled {
    color: hsla(0, 0%, 100%, 0.3) !important;
}

.btn-event {
    width: 100%;
    height: 45px !important;
}

.text-event {
    font-size: 15px;
    font-weight: 600;
}
.text-sub-event {
    font-weight: 600;
}
.text-queue {
    font-size: 50px;
    font-weight: 600;
}
.btn-delete {
    background-color: #FA4F00;
}
.btn-delete-disabled {
    background-color: hsla(0, 0%, 100%, 0.3) !important;
}
</style>
