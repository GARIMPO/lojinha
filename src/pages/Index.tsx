import { useEffect } from "react";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import ProductGrid from "@/components/ProductGrid";
import { getProducts, getCarouselImages } from "@/data/products";
import { useStoreInfo } from "@/hooks/use-store-info";
import { SocialMediaIcons } from "@/components/SocialIcons";
import { useThemeColors, applyOpacity } from "@/hooks/use-theme-colors";

const Index = () => {
  const { storeInfo } = useStoreInfo();
  const { colors } = useThemeColors();
  const products = getProducts();
  const carouselImages = getCarouselImages();
  
  // Aplicar cor de fundo personalizada
  const backgroundStyle = {
    backgroundColor: applyOpacity(colors.backgroundColor, colors.backgroundOpacity)
  };
  
  useEffect(() => {
    document.title = `${storeInfo.name} - Produtos de Tecnologia`;
  }, [storeInfo.name]);

  // Properly map image objects to the format expected by the Carousel component
  const carouselImagesWithTitles = carouselImages.map((image, index) => ({
    url: image.url,
    alt: image.alt,
    title: `Oferta Especial ${index + 1}`,
    description: "Aproveite nossas ofertas exclusivas com preços imperdíveis!"
  }));

  // Verificar se há pelo menos uma rede social ativa e com url
  const hasSocialMedia = Object.values(storeInfo.socials).some(
    (social) => social.enabled && social.url
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow" style={backgroundStyle}>
        {/* Hero Carousel */}
        <section className="w-full">
          <Carousel images={carouselImagesWithTitles} />
        </section>
        
        {/* Store Info */}
        <section className="bg-secondary/20 py-6">
          <div className="container mx-auto px-4 text-center">
            <h1 
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ 
                color: colors.storeInfoTextColor,
                fontFamily: colors.storeInfoFontFamily
              }}
            >
              {storeInfo.name}
            </h1>
            
            {/* Logo da Loja */}
            {storeInfo.logoUrl && (
              <div className="flex justify-center my-4">
                <img 
                  src={storeInfo.logoUrl} 
                  alt={`Logo ${storeInfo.name}`} 
                  className="w-[230px] h-[230px] object-contain rounded-md"
                />
              </div>
            )}
            
            <p 
              className="text-lg mb-1"
              style={{ 
                color: colors.storeInfoTextColor,
                fontFamily: colors.storeInfoFontFamily,
                fontSize: `${colors.storeInfoFontSize}px` 
              }}
            >
              A melhor loja de tecnologia do Brasil
            </p>
            <p 
              style={{ 
                color: colors.storeInfoTextColor,
                fontFamily: colors.storeInfoFontFamily,
                fontSize: `${Math.max(colors.storeInfoFontSize - 2, 12)}px` 
              }}
            >
              {storeInfo.phone} • {storeInfo.address}
            </p>
            
            {colors.showMapLink && colors.mapUrl && (
              <a 
                href={colors.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 underline"
                style={{ 
                  color: colors.primary,
                  fontFamily: colors.storeInfoFontFamily,
                  fontSize: `${Math.max(colors.storeInfoFontSize - 2, 12)}px` 
                }}
              >
                Ver loja no mapa
              </a>
            )}
          </div>
        </section>
        
        {/* Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ color: colors.productsTitleColor }}
          >
            {colors.productsTitle}
          </h2>
          
          <ProductGrid products={products} />
        </section>
      </main>
      
      {/* Social Media Section */}
      {hasSocialMedia && (
        <section className="bg-secondary/10 py-8">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-semibold mb-4">Siga-nos nas redes sociais</h3>
            <SocialMediaIcons socials={storeInfo.socials} />
          </div>
        </section>
      )}
      
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} {storeInfo.name} feito por{" "}
            <a 
              href="https://garimpodeofertas.com.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              Garimpo de ofertas
            </a>
            . Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
