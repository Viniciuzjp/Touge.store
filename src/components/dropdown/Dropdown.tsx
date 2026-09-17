import { Flex } from "@av-digital/components";
import { Text } from "@/components/text/Text";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Modal } from "./Modal";

export default function Dropdown() {
  const [modal, setModal] = useState<boolean>(false);
  return (
    <Flex direction="column">
      <div
        onMouseEnter={() => setModal(true)}
        onMouseLeave={() => setModal(false)}
      >
        <div className="flex items-center gap-1 p-4">
          <Text variant="menu">Vestuário</Text>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              modal ? "rotate-180" : ""
            }`}
          />
        </div>

        <div>
          <AnimatePresence>{modal && <Modal />}</AnimatePresence>
        </div>
      </div>
    </Flex>
  );
}
