import { Card } from "@av-digital/components";
import { Products } from "@/ui/shopifyinterface/interface";
import Link from "next/link";
import Image from "next/image";
import { Text } from "@/components/text/Text";
import { Stack } from "./Stack";
import { formatPrice } from "@/lib/currency";

type Props = {
  product: Products;
};

export default function ProductCard({ product }: Props) {
  const image = product.images[0];
  const variant = product.variants[0];

  return (
    <div className="group bg-white transition-colors ">
      <Link
        href={`/produtos/${encodeURIComponent(product.id)}`}
        className="flex flex-col h-full mb-10"
      >
        <div className="relative aspect-[10/10] overflow-hidden bg-neutral-100">
          <Image
            src={image?.src || "/placeholder.svg"}
            alt={image?.altText || product.title}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <Stack spacing="xs" align="start" className="py-5">
          <Text
            variant="productTitle"
          >
            {product.title}
          </Text>

          <Text
            variant="productPrice"
            classname="text-lg font-semibold tracking-tight text-neutral-900"
          >
            {variant
              ? formatPrice(variant.price.amount, variant.price.currencyCode)
              : "Indisponível"}
          </Text>
        </Stack>
      </Link>
    </div>
  );
}
