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
import { addData } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  pic: z.string().nonempty("Pic harus diisi."),
  mesin: z.string().nonempty("Mesin harus diisi."),
  tanggal_perbaikan: z.any(),
});

const TambahSchedule = ({ fetchData }) => {
  const [openTambah, setOpenTambah] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pic: "",
      mesin: "",
      tanggal_perbaikan: "",
    },
  });

  const handleTambah = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("pic", data.pic);
      formData.append("mesin", data.mesin);
      formData.append("tanggal_perbaikan", data.tanggal_perbaikan);

      const response = await addData("schedule", data);

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
        <Button>
          <PlusCircle />
          Tambah Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Schedule</DialogTitle>
          <DialogDescription>Tambahkan schedule baru.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleTambah)}
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
                      placeholder="masukkan pic..."
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
            <div className="w-fit space-y-2">
              <Label >Tanggal Perbaikan</Label>
              <Input type="date" {...form.register("tanggal_perbaikan")} />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Sedang menambahkan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahSchedule;