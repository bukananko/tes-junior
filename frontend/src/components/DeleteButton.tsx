import { useMutation, QueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * DeleteButton component.
 *
 * @description - A button component for deleting a product.
 * @param {Object} props - Component props.
 * @param {string} props.id_produk - The ID of the product to be deleted.
 * @param {QueryClient} props.qc - Query client instance.
 * @returns {JSX.Element} - The DeleteButton component.
 */
const DeleteButton = ({
  id_produk,
  qc,
}: {
  id_produk: string;
  qc: QueryClient;
}) => {
  /**
   * handleDelete function
   *
   * @description - Handles the deletion of a product.
   * @throws {Error} - If the request fails.
   * @returns {Promise<void>} - A promise that resolves when the request is complete.
   */
  const { mutate: handleDelete } = useMutation({
    mutationFn: async () => {
      try {
        await fetch(`/api/produk/${id_produk}`, {
          method: "DELETE",
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
    <AlertDialog>
      <AlertDialogTrigger className="ml-3 bg-red-500 text-white py-2 px-3 rounded-lg">
        Hapus
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin menghapus produk ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara
            permanen produk Anda dan hapus data produk Anda dari server kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            className="bg-red-500 hover:bg-red-600">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
