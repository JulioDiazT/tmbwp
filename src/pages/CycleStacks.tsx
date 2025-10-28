import React, { Suspense, lazy } from "react";

const CycleStacksList = lazy(() => import("./CycleStacksList"));
const DatawrapperEmbed = lazy(() => import("../components/DatawrapperEmbed"));

export default function CycleStacks() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-16">
      <Suspense fallback={<div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />}>
        <CycleStacksList />
      </Suspense>

  
    </div>
  );
}
