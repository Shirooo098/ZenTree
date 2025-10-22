import { DMSans, ManRope } from "@/app/ui/fonts";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
        <>
            <div className={`${ManRope.className}`}>
                <div className="flex justify-between">
                    <div className="flex flex-col">
                        <h3 className={`${DMSans.className} text-3xl text-dark-brown`}>
                            Content Management
                        </h3>
                        <span className="mt-2 text-muted-foreground">
                            A content management that manages the content of static pages.
                        </span>
                    </div>
                </div>
            </div>
            <>
                {children}
            </>
        </>
  );
}