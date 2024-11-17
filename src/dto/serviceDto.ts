interface ServiceDto {
  service_id: number;
  short_name: string;
  service_type_id: number;
  config_fee_id: string;
  extra_cost_id: string;
  standard_config_fee_id: string;
  standard_extra_cost_id: string;
  ecom_config_fee_id: number;
  ecom_extra_cost_id: number;
  ecom_standard_config_fee_id: number;
  ecom_standard_extra_cost_id: number;
}

export default ServiceDto;
