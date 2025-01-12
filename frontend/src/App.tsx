import type { Produk } from "./types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "./components/DeleteButton";
import EditButton from "./components/EditButton";
import AddProductButton from "./components/AddProductButton";

/**
 * App component
 *
 * @description - The main component of the application.
 * @returns {JSX.Element} - The App component.
 */
const App = () => {
  /**
   * Get the Query Client instance.
   *
   * @type {QueryClient}
   */
  const qc = useQueryClient();

  /**
   * Fetch the produk data using React Query.
   *
   * @returns {object[]} Array of produk.
   */
  const { data: produk } = useQuery<Produk[]>({
    queryKey: ["produk"],
    queryFn: async () => {
      const response = await fetch("/api/produk");
      const data = await response.json();
      return data ?? [];
    },
  });

  /**
   * Formats a number as a currency string in Indonesian Rupiah (IDR)
   *
   * @param {number} number - The number to format
   * @returns {string} - The formatted currency string
   */
  const formatCurrency = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  return (
    <>
      <header className="mx-3 mt-3 mb-5 flex justify-between items-center">
        <h1 className="text-lg xl:text-2xl font-bold">
          Produk yang bisa dijual
        </h1>
        <AddProductButton qc={qc} />
      </header>

      <section className="mx-3 md:grid-cols-2 xl:grid-cols-4 grid gap-8 mb-10">
        {produk?.map((item) => (
          <div
            key={item.id_produk}
            id={item.id_produk}
            className="p-3 border rounded-lg">
            <p className="font-semibold text-balance break-all">
              Nama: {item.nama_produk}
            </p>
            <p>Harga: {formatCurrency(item.harga)}</p>
            <p>Kategori: {item.kategori.nama_kategori}</p>
            <p className="font-semibold">Status: {item.status.nama_status}</p>
            <EditButton item={item} qc={qc} />
            <DeleteButton qc={qc} id_produk={item.id_produk} />
          </div>
        ))}
      </section>
    </>
  );
};

export default App;
