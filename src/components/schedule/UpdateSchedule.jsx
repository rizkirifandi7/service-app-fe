/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateData } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  pic: z.string().nonempty("pic harus diisi."),
  mesin: z.string().nonempty("Mesin harus diisi."),
  tanggal_perbaikan: z.any(),
});

const UpdateSchedule = ({ fetchData, rowData, id }) => {
  const [openTambah, setOpenTambah] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pic: rowData.pic,
      mesin: rowData.mesin,
      tanggal_perbaikan: rowData.tanggal_perbaikan,
    },
  });

  const handleUpdate = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("pic", data.pic);
      formData.append("mesin", data.mesin);
      formData.append("tanggal_perbaikan", data.tanggal_perbaikan);

      const response = await updateData(`schedule/${id}`, data);
      console.log(response);

      if (response.status === "success") {
        toast.success("Schedule berhasil ditambahkan");
        form.reset();
        setOpenTambah(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      toast.error("Gagal menambahkan schedule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openTambah} onOpenChange={setOpenTambah}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shadow-none">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Schedule</DialogTitle>
          <DialogDescription>Updatekan schedule baru.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="pic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIC</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-none"
                      placeholder="masukkan pIC..."
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mesin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mesin</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-none"
                      placeholder="masukkan mesin..."
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full space-y-2">
              <Label >Waktu Mulai Mesin</Label>
              <Input type="date" {...form.register("waktu_mulai_mesin")} />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSchedule;