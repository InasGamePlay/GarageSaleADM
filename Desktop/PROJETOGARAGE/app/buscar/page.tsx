import { Suspense } from "react";
import { BuscarClient } from "@/components/buscar-client";

export default function BuscarPage() {
  return (
    <Suspense>
      <BuscarClient />
    </Suspense>
  );
}
