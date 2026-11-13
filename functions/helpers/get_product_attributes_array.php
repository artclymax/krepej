<?php

function get_product_attributes_array(WC_Product $product)
{
	$result = [];

	foreach ($product->get_attributes() as $attribute) {

		if ($attribute->is_taxonomy()) {
			$name = wc_attribute_label($attribute->get_name());

			$values = wc_get_product_terms(
				$product->get_id(),
				$attribute->get_name(),
				['fields' => 'names']
			);
		} else {
			$name = $attribute->get_name();
			$values = $attribute->get_options();
		}

		if (!empty($values)) {
			$result[] = [
				'name' => $name,
				'values' => $values,
			];
		}
	}

	return $result;
}