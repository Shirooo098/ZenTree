import { useProductId } from "@/app/lib/query/admin/product-data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pen } from "lucide-react"
import { useState } from "react"

export function EditProductDialog({productId}: { productId: number }) {
  const [open, setOpen] = useState(false);

  const {data: product, isLoading} = useProductId(productId, {
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 cursor-pointer">
                <Pen/>
                Edit
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>
              Make changes to product here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Product Name</Label>
              <Input id="name-1" name="name" defaultValue={`${product?.name}` }/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-dark-brown">Save changes</Button>
          </DialogFooter>
        </DialogContent>

    </Dialog>
  )
}
