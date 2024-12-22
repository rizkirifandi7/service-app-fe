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
  nama: z.string().nonempty("Nama harus diisi."),
  mesin: z.string().nonempty("Mesin harus diisi."),
  deskripsi_kerusakan: z.string().nonempty("Deskripsi harus diisi."),
  gambar: z.any(),
  tindakan: z.string().nonempty("Tindakan harus diisi."),
  waktu_mulai_mesin: z.any(),
  waktu_selesai_mesin: z.any(),
});

const TambahRekaman = ({ fetchData }) => {
  const [openTambah, setOpenTambah] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nama: "",
      mesin: "",
      deskripsi_kerusakan: "",
      gambar: "",
      tindakan: "",
      waktu_mulai_mesin: "",
      waktu_selesai_mesin: "",
    },
  });

  const handleTambah = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama", data.nama);
      formData.append("mesin", data.mesin);
      formData.append("deskripsi_kerusakan", data.deskripsi_kerusakan);
      formData.append("gambar", data.gambar[0]);
      formData.append("tindakan", data.tindakan);
      formData.append("waktu_mulai_mesin", data.waktu_mulai_mesin);
      formData.append("waktu_selesai_mesin", data.waktu_selesai_mesin);

      const response = await addData("laporan", formData);

      if (response.status === "success") {
        toast.success("Laporan berhasil ditambahkan");
        form.reset();
        setOpenTambah(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error adding laporan:", error);
      toast.error("Gagal menambahkan laporan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openTambah} onOpenChange={setOpenTambah}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Tambah Laporan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Laporan</DialogTitle>
          <DialogDescription>Tambahkan laporan baru.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleTambah)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-none"
                      placeholder="masukkan nama..."
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
            <FormField
              control={form.control}
              name="deskripsi_kerusakan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Kerusakan</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-none"
                      placeholder="masukkan deskripsi kerusakan..."
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
              name="tindakan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tindakan</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-none"
                      placeholder="masukkan tindakan..."
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between w-full gap-4">
              <div className="w-full space-y-2">
                <Label >Waktu Mulai Mesin</Label>
                <Input type="date" {...form.register("waktu_mulai_mesin")} />
              </div>
              <span className="pt-7">-</span>
              <div className="w-full space-y-2">
                <Label >Waktu selesai Mesin</Label>
                <Input type="date" {...form.register("waktu_selesai_mesin")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gambar</Label>
              <Input
                type="file"
                className="shadow-none h-full py-1.5"
                onChange={(e) => form.setValue("gambar", e.target.files)}
              />
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

export default TambahRekaman;