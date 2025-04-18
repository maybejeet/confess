import { Suspense } from "react";
import ErrorPageClient from "./error/components/page";

export default function GlobalError() {
  return (
    <html>
      <body>
        <Suspense fallback={<div>Loading error...</div>}>
          <ErrorPageClient />
        </Suspense>
      </body>
    </html>
  );
}
