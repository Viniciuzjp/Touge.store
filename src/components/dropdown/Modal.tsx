import { Text } from "@/components/text/Text";
import Link from "next/link";
import { motion } from "framer-motion";

const Vestuario = [
  {
    id: 1,
    title: "Camisetas Automobilisticas",
    href: "/categories/automotivo"
  },
  {
    id: 2,
    title: "Camisetas Pilotos",
    href: "/categories/pilotos"
  },
  {
    id: 3,
    title: "Camisetas Filmes",
    href: "/categories/filmes"
  },
  {
    id: 4,
    title: "Todo Catálogo",
    href: "/products"
  },
];

export const Modal = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className=" absolute bg-neutral-950"
    >
      {Vestuario.map((item) => (
        <div key={item.id} className="p-4 w-100 hover:pl-6 hover:border-b hover:border-b-neutral-600 hover:bg-neutral-800 transition-all duration-200">
        <Link href={item.href || ""}>
        <Text variant="label">{item.title}</Text>
        </Link>
        </div>
      ))}
    </motion.div>
  );
};
