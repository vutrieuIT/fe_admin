<template>
  <h2>Đơn hàng GHN</h2>
  <div class="grid">
    <div class="col-2 text-left">Mã đơn hàng</div>
    <div class="col-4 text-left">{{ order.id }}</div>
    <div class="col-2 text-left">Tên khách hàng</div>
    <div class="col-4 text-left">{{ user.name }}</div>
    <div class="col-2 text-left">Tổng tiền</div>
    <div class="col-4 text-left">{{ order.totalBill }}</div>
    <div class="col-2 text-left">Trạng thái</div>
    <div class="col-4 text-left">{{ order.status }}</div>
    <div class="col-2 text-left">Thanh toán</div>
    <div class="col-4 text-left">{{ order.paymentStatus }}</div>
    <div class="col-2 text-left">Kiểu thanh toán</div>
    <div class="col-4 text-left">{{ order.paymentType }}</div>
    <div class="col-2 text-left">Ngày tạo</div>
    <div class="col-4 text-left">
      {{ new Date(order.createdAt).toLocaleDateString() }}
    </div>
    <div class="col-2 text-left">Số điện thoại</div>
    <div class="col-4 text-left">{{ order.phoneNumber }}</div>
    <div class="col-2 text-left">Địa chỉ</div>
    <div class="col-4 text-left">{{ order.toAddress }}</div>
    <div class="col-2 text-left">Ghi chú</div>
    <div class="col-4 text-left">{{ order.note }}</div>
    <div class="col-2 text-left">Mã đơn GHN</div>
    <div class="col-4 text-left">{{ order.shippingOrderId }}</div>
    <div class="col-2 text-left">Trạng thái đơn GHN</div>
    <div class="col-4 text-left">{{ order.shippingOrderStatus }}</div>
    <div class="col-2 text-left">Phí vận chuyển</div>
    <div class="col-4 text-left">{{ shippingFee }}</div>
    <div class="col-2 text-left">Người trả phí</div>
    <div class="col-4 text-left">
      <Dropdown
        v-model="rolePayment"
        :options="ROLE_PAYMENT_CONST"
        optionLabel="label"
        optionValue="value"
      />
    </div>
    <div class="col-2 text-left">Xem hàng</div>
    <div class="col-4 text-left">
      <Dropdown
        v-model="checkOrder"
        :options="CHECK_ORDER_CONST"
        optionLabel="label"
        optionValue="value"
      />
    </div>
    <div class="col-2 text-left">Chiều dài đơn</div>
    <div class="col-4 text-left">
      <InputNumber
        v-model="sizeOrder.length"
        placeholder="Dài"
        :invalid="sizeOrder.length <= 0"
      />
    </div>
    <div class="col-2 text-left">Chiều rộng đơn</div>
    <div class="col-4 text-left">
      <InputNumber
        v-model="sizeOrder.width"
        placeholder="Rộng"
        :invalid="sizeOrder.width <= 0"
      />
    </div>
    <div class="col-2 text-left">Chiều cao đơn</div>
    <div class="col-4 text-left">
      <InputNumber
        v-model="sizeOrder.height"
        placeholder="Cao"
        :invalid="sizeOrder.height <= 0"
      />
    </div>
    <div class="col-12 flex pr-4 justify-content-end">
      <Button
        class="ml-2"
        v-if="statusGHNOrder === 1"
        label="Tạo đơn GHN"
        @click="createGHNOrder"
      />
      <Button
        class="ml-2"
        v-if="statusGHNOrder === 2"
        label="Hủy đơn GHN"
        @click="cancelGHNOrder"
      />
      <Button
        class="ml-2"
        v-if="statusGHNOrder === 3"
        label="Tái tạo đơn GHN"
        @click="createGHNOrder"
      />
    </div>
  </div>
</template>
<script lang="ts">
import ApiUtils from "@/util/apiUtil";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import OrderDto from "@/dto/orderDto";
import User from "@/dto/userDto";
import Button from "primevue/button";
import ServiceDto from "@/dto/serviceDto";
import ORDER_STATUS_CONSTANT from "@/constants/orderStatusConstant";
import Dropdown from "primevue/dropdown";
import CHECK_ORDER_CONST from "@/constants/checkOrderConst";
import ROLE_PAYMENT_CONST from "@/constants/rolePaymentConst";
import AdminOrderDto from "@/dto/adminOrderDto";
import InputNumber from "primevue/inputnumber";

interface SizeOrder {
  length: number;
  width: number;
  height: number;
}

export default defineComponent({
  name: "GHNOrderView",
  components: {
    Button,
    Dropdown,
    InputNumber,
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const orderId = Array.isArray(router.currentRoute.value.params.id) // orderId luôn là string
      ? router.currentRoute.value.params.id[0]
      : router.currentRoute.value.params.id;
    const order = ref({} as OrderDto);
    const user = ref({} as User);
    const service = ref([] as ServiceDto[]);
    const shippingFee = ref(0);

    const checkOrder = ref(CHECK_ORDER_CONST[0].value);
    const rolePayment = ref(ROLE_PAYMENT_CONST[0].value);

    const sizeOrder = ref<SizeOrder>({
      length: 1,
      width: 1,
      height: 1,
    });

    const statusGHNOrder = computed(() => {
      if (
        order.value.shippingOrderId !== null &&
        order.value.shippingOrderId !== ""
      ) {
        if (
          order.value.shippingOrderStatus === ORDER_STATUS_CONSTANT.CANCELED
        ) {
          return 3; // Đã hủy
        }
        return 2; // Đã tạo đơn
      }

      return 1; // Chưa tạo đơn
    });

    const getOrder = async () => {
      await ApiUtils.get(`/api/order-detail/${orderId}`)
        .then((response) => {
          order.value = response.data.order;
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: error.response.data,
            life: 3000,
          });
        });
    };

    const getUser = async () => {
      await ApiUtils.get(`/api/user-info/${order.value.userId}`)
        .then((response) => {
          user.value = response.data;
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: error.response.data,
            life: 3000,
          });
        });
    };

    const createGHNOrder = async () => {
      const body: AdminOrderDto = {
        orderId: orderId,
        paymentTypeId: rolePayment.value,
        serviceTypeId: 2, // hàng nhẹ
        requiredNote: checkOrder.value,
        weight: order.value.totalWeight,
        length: sizeOrder.value.length,
        width: sizeOrder.value.width,
        height: sizeOrder.value.height,
        fromName: "Shop",
        fromPhone: "0339554433",
        fromAddress: "01 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh",
        toName: user.value.name,
        toPhone: order.value.phoneNumber,
        toAddress: order.value.toAddress,
        note: order.value.note,
        codAmount:
          order.value.status === "Đã thanh toán" ? order.value.totalBill : 0,
      };
      await ApiUtils.post(`/api/ghn/create-ship-order`, body)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Đã tạo đơn GHN",
            life: 3000,
          });
          getOrder();
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: error.response.data,
            life: 3000,
          });
        });
    };

    const cancelGHNOrder = async () => {
      await ApiUtils.post(`/api/ghn/cancel-ship-order/${orderId}`)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Đã hủy đơn GHN",
            life: 3000,
          });
          getOrder();
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: error.response.data,
            life: 3000,
          });
        });
    };

    const getShippingFee = async () => {
      await ApiUtils.get(`/api/ghn/shipping-fee/${order.value.id}/2`)
        .then((response) => {
          shippingFee.value = response.data;
        })
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: error.response.data,
            life: 3000,
          });
        });
    };

    onMounted(async () => {
      await getOrder();
      await getUser();
      await getShippingFee();
    });
    return {
      order,
      user,
      statusGHNOrder,
      service,
      shippingFee,
      checkOrder,
      rolePayment,
      sizeOrder,
      cancelGHNOrder,
      createGHNOrder,

      CHECK_ORDER_CONST,
      ROLE_PAYMENT_CONST,
    };
  },
});
</script>
