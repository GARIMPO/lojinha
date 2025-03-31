import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Edit, ImageIcon, ShoppingBag, Type, Phone, Paintbrush, Share2 } from "lucide-react";

const Admin = () => {
  useEffect(() => {
    document.title = "Admin - Loja Online";
  }, []);

  const cardStyles = [
    { backgroundColor: "#ffffff" },  // branco
    { backgroundColor: "#f5f5f5" }   // cinza claro
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Área Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card style={cardStyles[0]} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Editar Carrossel
              </CardTitle>
              <CardDescription>
                Gerencie as imagens e textos do carrossel da página inicial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/carrossel">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Editar Carrossel
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card style={cardStyles[1]} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Editar Produtos
              </CardTitle>
              <CardDescription>
                Gerencie os produtos disponíveis na loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/produtos">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Editar Produtos
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card style={cardStyles[0]} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Editar Nome da Loja
              </CardTitle>
              <CardDescription>
                Altere o nome da loja exibido no cabeçalho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/nome-loja">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Editar Nome
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card style={cardStyles[1]} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                WhatsApp para Pedidos
              </CardTitle>
              <CardDescription>
                Configure o número de WhatsApp para receber pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/whatsapp">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Editar WhatsApp
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card style={cardStyles[0]} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5" />
                Personalizar Cores
              </CardTitle>
              <CardDescription>
                Edite as cores e transparência do cabeçalho e cards de produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/tema">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Editar Cores
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card style={cardStyles[1]} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Redes Sociais
              </CardTitle>
              <CardDescription>
                Configure os links e ative/desative as redes sociais da loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/social">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Editar Links
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
