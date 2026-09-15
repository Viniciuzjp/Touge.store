interface ImageType {
  src: string;
  altText: string | null;
  width: number;
  height: number;
}

interface SelectedOption {
  name: string;
  value: string;
}

interface Variant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
}

interface ProductOption {
  name: string;
  values: string[];
}

type Products = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  images: ImageType[];
  variants: Variant[];
  options: ProductOption[];
};

export type { ImageType, Variant, Products, ProductOption, SelectedOption };