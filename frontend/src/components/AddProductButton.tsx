import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * AddProductButton component.
 *
 * @description - This component represents a button that triggers a dialog for adding a new product.
 * @param {object} props - Component props.
 * @param {QueryClient} props.qc - Query client instance.
 * @returns {JSX.Element} - The AddProductButton component.
 */
const AddProductButton = ({ qc }: { qc: QueryClient }) => {
  /**
   * handleSubmit function.
   *
   * @description - Makes a POST request to the API to add a new product.
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event.
   * @throws {Error} - If the request fails.
   * @returns {Promise<void>} - A promise that resolves when the request is complete.
   */
  const { mutate: handleSubmit } = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        const target = e.target as HTMLFormElement;

        if (target.nama.value.trim() === "") {
          return toast.error("Nama tidak boleh kosong");
        }

        if (
          Number(target.harga.value) < 1000 ||
          Number.isNaN(Number(target.harga.value))
        ) {
          return toast.error(
            "Harga harus berupa angka dan harus lebih dari 1000"
          );
        }

        await fetch(`/api/produk`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            nama: target.nama.value,
            harga: Number(target.harga.value),
            kategori: target.kategori.value,
            status: target.status.value,
          }),
        });
      } catch (error) {
        console.error(error);
      }
    },
    /**
     * onSuccess function.
     *
     * @description Invalidates the "produk" query after a successful mutation.
     */
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["produk"] });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" bg-blue-500 hover:bg-blue-600">
          Tambah Produk
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah produk</DialogTitle>
          <DialogDescription>
            Lakukan penambahan produk Anda di sini. Klik simpan saat Anda sudah
            selesai.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-right">
              Nama
            </Label>
            <Input
              required
              id="nama"
              placeholder="Nama Produk..."
              className="col-span-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="harga" className="text-right">
              Harga
            </Label>
            <Input
              required
              type="number"
              id="harga"
              placeholder="Harga Produk..."
              className="col-span-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori" className="text-right">
              Kategori
            </Label>
            <Select name="kategori">
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L QUEENLY">L QUEENLY</SelectItem>
                <SelectItem value="L MTH AKSESORIS (IM)">
                  L MTH AKSESORIS (IM)
                </SelectItem>
                <SelectItem value="L MTH TABUNG (LK)">
                  L MTH TABUNG (LK)
                </SelectItem>
                <SelectItem value="SP MTH SPAREPART (LK)">
                  SP MTH SPAREPART (LK)
                </SelectItem>
                <SelectItem value="CI MTH TINTA LAIN (IM)">
                  CI MTH TINTA LAIN (IM)
                </SelectItem>
                <SelectItem value="L MTH AKSESORIS (LK)">
                  L MTH AKSESORIS (LK)
                </SelectItem>
                <SelectItem value="S MTH STEMPEL (IM)">
                  S MTH STEMPEL (IM)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select name="status">
              <SelectTrigger>
                <SelectValue placeholder="Pilih status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bisa dijual">Bisa Dijual</SelectItem>
                <SelectItem value="tidak bisa dijual">
                  Tidak Bisa Dijual
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogClose asChild>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Simpan
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductButton;
