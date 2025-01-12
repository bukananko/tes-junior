export type Produk = {
  id_produk: string;
  nama_produk: string;
  harga: number;
  kategori_id: string;
  kategori: Kategori;
  status_id: string;
  status: Status;
};

export type Kategori = {
  id_kategori: string;
  nama_kategori: string;
  produk: Produk[];
};

export type Status = {
  id_status: string;
  nama_status: string;
  produk: Produk[];
};
