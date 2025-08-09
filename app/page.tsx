import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const products = [
  {
    id: 1,
    name: "Royal Ruby Necklace",
    price: 1499,
    image: "/products/ruby-necklace.jpg",
    description:
      "A timeless imitation jewellery piece crafted to perfection with royal red rubies and golden accents.",
  },
  {
    id: 2,
    name: "Golden Ruby Earrings",
    price: 899,
    image: "/products/ruby-earrings.jpg",
    description:
      "Elegant imitation ruby earrings that shimmer with every move, perfect for special occasions.",
  },
  {
    id: 3,
    name: "Majestic Ruby Ring",
    price: 699,
    image: "/products/ruby-ring.jpg",
    description:
      "A premium imitation ruby ring with a gold-plated finish for a luxurious feel.",
  },
];

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-[#fdf6f0] to-[#fff] min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/ruby-host.jpg"
            alt="Ruby Host Logo"
            width={50}
            height={50}
            className="rounded-full"
            priority
          />
          <h1 className="text-2xl font-bold text-[#8B0000]">Ruby Host</h1>
        </div>
        <nav className="flex gap-6 text-lg">
          <a href="#story" className="hover:text-[#8B0000]">
            Our Story
          </a>
          <a href="#shop" className="hover:text-[#8B0000]">
            Shop
          </a>
          <a href="#contact" className="hover:text-[#8B0000]">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative text-center py-20 bg-[url('/banners/ruby-bg.jpg')] bg-cover bg-center text-white">
        <div className="bg-black bg-opacity-50 p-10 inline-block rounded-xl">
          <h2 className="text-4xl font-bold mb-4">Elegance That Lasts Forever</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Discover the charm of premium imitation jewellery with Ruby Host. Crafted with precision, designed for grace.
          </p>
          <Button className="bg-[#8B0000] text-white hover:bg-[#a50000]">
            Explore Collection
          </Button>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="p-12 text-center max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-[#8B0000] mb-4">Our Story</h3>
        <p className="text-gray-700 leading-relaxed">
          At Ruby Host, we believe that jewellery isn’t just an accessory – it’s a story. Each piece we create tells a tale of artistry, passion, and timeless elegance. From intricate ruby patterns to gold-plated finesse, our imitation jewellery stands out in beauty and affordability.
        </p>
      </section>

      {/* Shop Section */}
      <section id="shop" className="p-12 bg-[#fff8f5]">
        <h3 className="text-3xl font-bold text-center text-[#8B0000] mb-8">
          Shop Our Collection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <Card key={product.id} className="shadow-lg hover:shadow-xl transition">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="rounded-t-xl"
              />
              <CardContent className="p-4">
                <h4 className="text-xl font-bold mb-2">{product.name}</h4>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-lg font-bold text-[#8B0000] mb-4">₹{product.price}</p>
                <Button className="bg-[#8B0000] text-white hover:bg-[#a50000]">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="p-12 text-center">
        <h3 className="text-3xl font-bold text-[#8B0000] mb-4">Contact Us</h3>
        <p className="text-gray-700">
          For custom orders or inquiries, email us at {" "}
          <a href="mailto:info@rubyhost.com" className="text-[#8B0000] underline">
            info@rubyhost.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#8B0000] text-white text-center p-6 mt-10">
        © {new Date().getFullYear()} Ruby Host. All Rights Reserved.
      </footer>
    </main>
  );
}