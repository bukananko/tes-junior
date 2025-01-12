import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Produk } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * EditButton component.
 *
 * @description - This component represents a button that triggers a dialog for edit a product.
 * @param {Object} props - Component props.
 * @param {Produk} props.item - The product to be edited.
 * @param {QueryClient} props.qc - Query client instance.
 * @returns {JSX.Element} - The EditButton component.
 */
const EditButton = ({ item, qc }: { item: Produk; qc: QueryClient }) => {
  /**
   * handleSubmit function
   *
   * @description - Handles the form submission for editing a product.
   * @param {Object} params  - Object containing the form submission event and the ID of the product to be edited.
   * @param {React.FormEvent<HTMLFormElement>} params.e - Form submission event.
   * @param {string} params.id_produk - The ID of the product to be edited.
   * @throws {Error} - If the request fails.
   * @returns {Promise<void>} - A promise that resolves when the request is complete.
   */
  const { mutate: handleSubmit } = useMutation({
    mutationFn: async ({
      e,
      id_produk,
    }: {
      e: React.FormEvent<HTMLFormElement>;
      id_produk: string;
    }) => {
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

        await fetch(`/api/produk/edit/${id_produk}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({
            nama: target.nama.value,
            harga: Number(target.harga.value),
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
        <Button className="mt-3">Edit Produk</Button>
      </DialogTrigger>

      <DialogContent id={item.id_produk} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit produk</DialogTitle>
          <DialogDescription>
            Lakukan perubahan pada produk Anda di sini. Klik simpan saat Anda
            sudah selesai.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => handleSubmit({ e, id_produk: item.id_produk })}
          className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-right">
              Nama
            </Label>
            <Input
              required
              id="nama"
              defaultValue={item.nama_produk}
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
              defaultValue={item.harga}
              className="col-span-3"
            />
          </div>

          <DialogClose asChild>
            <Button type="submit">Simpan</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditButton;
