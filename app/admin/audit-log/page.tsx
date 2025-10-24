import { DMSans, ManRope } from "@/app/ui/fonts";

export default function Page(){
    return(
        <div className={`${ManRope.className}`}>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h3 className={`${DMSans.className} text-3xl text-dark-brown`}>
                        Audit Log
                    </h3>
                    <span className="mt-2 text-muted-foreground">
                        An audit log that tracks the recent record of events.
                    </span>
                </div>
            </div>
        </div>
    )
}