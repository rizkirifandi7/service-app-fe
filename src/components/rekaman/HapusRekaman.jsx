/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteData } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const HapusRekaman = ({ id, fetchData }) => {
  const [openHapus, setOpenHapus] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteData(`laporan/${selectedId}`);
      console.log(response);
      if (response.status === "success") {
        toast.success("Laporan berhasil dihapus");
        setOpenHapus(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting laporan:", error);
      toast.error("Gagal menghapus laporan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={openHapus} onOpenChange={setOpenHapus}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shadow-none "
            onClick={() => {
              setSelectedId(id);
            }}
          >
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Laporan</DialogTitle>
            <DialogDescription>
              Apakah anda yakin ingin menghapus laporan ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => handleDelete()}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Hapus"}
            </Button>
            <div className="w-full" onClick={() => setOpenHapus(false)}>
              <Button variant="outline" className="w-full">
                Batal
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HapusRekaman;