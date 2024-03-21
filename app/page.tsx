import GenerateLink from "@/components/generateLink";
import { Suspense } from "react";
export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<Suspense>
			<GenerateLink />
			</Suspense>
		</section>
	);
}
