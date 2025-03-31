import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Save, Trash2, Upload, ImageIcon, X, Loader2, Ticket, Info } from "lucide-react";
import { getProducts } from "@/data/products";
import { Product } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useThemeColors } from "@/hooks/use-theme-colors";

// Interface para controlar o estado de upload
interface UploadState {
  [key: string]: {
    isUploading: boolean;
    progress: number;
    size: number;
  };
}

const EditProducts = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState<Product[]>([]);
  const [globalCouponCode, setGlobalCouponCode] = useState<string>("");
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
  const [uploadState, setUploadState] = useState<UploadState>({});
  const { colors } = useThemeColors();

  // Load products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const savedProducts = localStorage.getItem("productList");
      if (savedProducts) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          setProductList(parsedProducts);
          
          // Verificar se há algum produto com cupom e usar o primeiro como global
          const productWithCoupon = parsedProducts.find((p: Product) => p.couponCode && p.discountPercent > 0);
          if (productWithCoupon) {
            setGlobalCouponCode(productWithCoupon.couponCode || "");
            setGlobalDiscountPercent(productWithCoupon.discountPercent || 0);
            console.log("Cupom carregado:", productWithCoupon.couponCode, "Desconto:", productWithCoupon.discountPercent);
          }
        } catch (error) {
          console.error("Error parsing saved products:", error);
          setProductList(getProducts());
        }
      } else {
        setProductList(getProducts());
      }
    };

    fetchProducts();
  }, []);

  const cardStyles = [
    { backgroundColor: "#ffffff" },  // branco
    { backgroundColor: "#f5f5f5" }   // cinza claro
  ];

  const handleProductChange = (id: number, field: string, value: string | number | boolean) => {
    setProductList(productList.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const handleImageUpload = async (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.match('image.*')) {
      toast({
        title: "Erro ao carregar imagem",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive",
      });
      return;
    }

    // Limite de tamanho de 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro ao carregar imagem",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Iniciar o estado de upload
    const uploadId = `main-${id}`;
    setUploadState(prev => ({
      ...prev,
      [uploadId]: {
        isUploading: true,
        progress: 0,
        size: file.size
      }
    }));

    const reader = new FileReader();
    
    // Adicionar evento para capturar o progresso
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadState(prev => ({
          ...prev,
          [uploadId]: {
            ...prev[uploadId],
            progress
          }
        }));
      }
    };
    
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const imageDataUrl = reader.result as string;
        
        // Simular um pequeno atraso para mostrar o progresso
        setTimeout(() => {
          setProductList(productList.map(product => 
            product.id === id ? { ...product, image: imageDataUrl } : product
          ));
          
          // Finalizar o upload
          setUploadState(prev => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              isUploading: false,
              progress: 100
            }
          }));
        }, 500);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro ao carregar imagem",
        description: "Ocorreu um erro ao carregar a imagem. Tente novamente.",
        variant: "destructive",
      });
      setUploadState(prev => {
        const newState = {...prev};
        delete newState[uploadId];
        return newState;
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Função para upload de imagens adicionais
  const handleAdditionalImageUpload = async (id: number, index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.match('image.*')) {
      toast({
        title: "Erro ao carregar imagem",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive",
      });
      return;
    }

    // Limite de tamanho de 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro ao carregar imagem",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Iniciar o estado de upload
    const uploadId = `additional-${id}-${index}`;
    setUploadState(prev => ({
      ...prev,
      [uploadId]: {
        isUploading: true,
        progress: 0,
        size: file.size
      }
    }));

    const reader = new FileReader();
    
    // Adicionar evento para capturar o progresso
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadState(prev => ({
          ...prev,
          [uploadId]: {
            ...prev[uploadId],
            progress
          }
        }));
      }
    };
    
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const imageDataUrl = reader.result as string;
        
        // Simular um pequeno atraso para mostrar o progresso
        setTimeout(() => {
          setProductList(productList.map(product => {
            if (product.id === id) {
              // Criar cópia das imagens adicionais do produto
              const additionalImages = [...product.additionalImages];
              // Adicionar ou substituir a imagem no índice especificado
              additionalImages[index] = imageDataUrl;
              return { ...product, additionalImages };
            }
            return product;
          }));
          
          // Finalizar o upload
          setUploadState(prev => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              isUploading: false,
              progress: 100
            }
          }));
        }, 500);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro ao carregar imagem",
        description: "Ocorreu um erro ao carregar a imagem adicional. Tente novamente.",
        variant: "destructive",
      });
      setUploadState(prev => {
        const newState = {...prev};
        delete newState[uploadId];
        return newState;
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Função para remover uma imagem adicional
  const handleRemoveAdditionalImage = (id: number, index: number) => {
    setProductList(productList.map(product => {
      if (product.id === id) {
        const additionalImages = [...product.additionalImages];
        additionalImages.splice(index, 1);
        return { ...product, additionalImages };
      }
      return product;
    }));
  };

  const handleDeleteProduct = (id: number) => {
    setProductList(productList.filter(product => product.id !== id));
  };

  const handleAddProduct = () => {
    const newId = Math.max(0, ...productList.map(p => p.id)) + 1;
    setProductList([
      ...productList,
      {
        id: newId,
        name: "Novo Produto",
        description: "Descrição do novo produto",
        price: 0,
        image: "",
        additionalImages: [],
        isPromotion: false,
        couponCode: globalCouponCode,
        discountPercent: globalDiscountPercent
      }
    ]);
  };

  const handleSave = () => {
    // Verificar se um cupom foi configurado corretamente
    if (globalDiscountPercent > 0 && !globalCouponCode.trim()) {
      toast({
        title: "Aviso",
        description: "Você definiu um desconto mas não especificou o código do cupom.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      // Aplicar o cupom global a todos os produtos
      const updatedProductList = productList.map(product => ({
        ...product,
        couponCode: globalCouponCode.trim(),
        discountPercent: globalDiscountPercent
      }));
      
      localStorage.setItem("productList", JSON.stringify(updatedProductList));
      setProductList(updatedProductList);
      
      const mensagem = globalCouponCode.trim() 
        ? `Cupom global '${globalCouponCode}' com ${globalDiscountPercent}% de desconto aplicado a todos os produtos.` 
        : "Produtos salvos com sucesso.";
      
      toast({
        title: "Produtos salvos",
        description: mensagem,
        duration: 3000,
      });
    } catch (error) {
      console.error("Erro ao salvar produtos:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os produtos. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Função para formatar o tamanho em KB ou MB
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Renderização dos componentes
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Editar Produtos</h1>
          </div>
          <Button onClick={handleAddProduct} className="bg-primary text-white">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
          </Button>
        </div>
        
        {/* Seção de Cupom Global */}
        <Card className="mb-6 border shadow-sm">
          <CardHeader className="p-4 flex flex-row items-center justify-between bg-muted/30">
            <CardTitle className="text-lg flex items-center">
              <Ticket className="h-5 w-5 mr-2" />
              Cupom de Desconto Global
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="global-coupon">Código do Cupom</Label>
                  <Input
                    id="global-coupon"
                    value={globalCouponCode}
                    onChange={(e) => setGlobalCouponCode(e.target.value)}
                    className="mt-1"
                    placeholder="Ex: DESCONTO20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Este código será usado como senha do cupom para todos os produtos
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="global-discount">Porcentagem de Desconto (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="global-discount"
                      type="number"
                      value={globalDiscountPercent}
                      onChange={(e) => setGlobalDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="mt-1"
                      min={0}
                      max={100}
                      step={1}
                    />
                    <span className="text-sm">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    O desconto será aplicado ao valor total do carrinho quando o cliente inserir o código
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-sm flex items-center">
                <Info className="h-4 w-4 mr-2 text-green-600" />
                <span>Quando o cliente inserir o código <strong>{globalCouponCode || "CODIGO"}</strong>, receberá <strong>{globalDiscountPercent}%</strong> de desconto no valor total da compra.</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {productList.map((product, index) => {
            const mainUploadId = `main-${product.id}`;
            const isMainUploading = uploadState[mainUploadId]?.isUploading;
            const mainProgress = uploadState[mainUploadId]?.progress || 0;
            const mainSize = uploadState[mainUploadId]?.size || 0;
            
            return (
              <Card 
                key={product.id} 
                className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow" 
                style={cardStyles[index % 2]}
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between" style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#f0f0f0' }}>
                <CardTitle className="text-lg">Produto {product.id}</CardTitle>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <Label htmlFor={`name-${product.id}`}>Nome do Produto</Label>
                      <Input
                        id={`name-${product.id}`}
                        value={product.name}
                        onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor={`desc-${product.id}`}>Descrição</Label>
                      <Textarea
                        id={`desc-${product.id}`}
                        value={product.description}
                        onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor={`price-${product.id}`}>Preço (R$)</Label>
                      <Input
                        id={`price-${product.id}`}
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div className="mb-4 flex items-center gap-2">
                      <Switch
                        id={`promotion-${product.id}`}
                        checked={!!product.isPromotion}
                        onCheckedChange={(checked) => handleProductChange(product.id, 'isPromotion', checked)}
                      />
                      <Label htmlFor={`promotion-${product.id}`} className="font-medium">
                        {product.isPromotion ? "Em promoção" : "Marcar como Promoção"}
                      </Label>
                      {product.isPromotion && (
                        <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-700 font-medium rounded-full">
                          Promoção
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor={`image-upload-${product.id}`}>Imagem Principal</Label>
                      <div className="mt-1 flex items-center">
                        <label htmlFor={`image-upload-${product.id}`} className={`w-full cursor-pointer ${isMainUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                          <div className="flex items-center justify-center w-full border-2 border-dashed border-muted-foreground/40 rounded-md py-3 px-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            {isMainUploading ? (
                              <Loader2 className="h-5 w-5 mr-2 text-primary animate-spin" />
                            ) : (
                              <Upload className="h-5 w-5 mr-2 text-muted-foreground" />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {isMainUploading ? `Carregando... ${mainProgress}%` : 'Escolher imagem principal'}
                            </span>
                          </div>
                          <Input
                            id={`image-upload-${product.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(product.id, e)}
                            className="hidden"
                            disabled={isMainUploading}
                          />
                        </label>
                      </div>
                      {isMainUploading && (
                        <div className="mt-2">
                          <Progress value={mainProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Carregando {formatFileSize(mainSize)} - {mainProgress}% concluído
                          </p>
                        </div>
                      )}
                      {!isMainUploading && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Selecione uma imagem para o produto (máx. 5MB)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="bg-muted rounded-lg p-4 flex-1">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-48 object-contain rounded-md"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-48 bg-secondary/20 rounded-md">
                          <ImageIcon className="h-10 w-10 text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">Nenhuma imagem selecionada</p>
                        </div>
                      )}
                    </div>

                    {/* Seção de Imagens Adicionais */}
                    <div className="bg-muted/40 rounded-lg p-4">
                      <Label className="mb-2 block">Imagens Adicionais (até 3)</Label>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {product.additionalImages.map((imgUrl, imgIndex) => (
                          <div key={imgIndex} className="relative group rounded-md overflow-hidden border border-muted">
                            <img 
                              src={imgUrl} 
                              alt={`${product.name} - Imagem ${imgIndex + 1}`}
                              className="w-full h-20 object-cover"
                            />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveAdditionalImage(product.id, imgIndex)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}

                        {Array.from({ length: 3 - product.additionalImages.length }).map((_, emptyIndex) => {
                          const imgIndex = product.additionalImages.length + emptyIndex;
                          const uploadId = `additional-${product.id}-${imgIndex}`;
                          const isUploading = uploadState[uploadId]?.isUploading;
                          const progress = uploadState[uploadId]?.progress || 0;
                          const size = uploadState[uploadId]?.size || 0;
                          
                          return (
                            <div key={`empty-${emptyIndex}`} className="flex flex-col">
                              <label 
                                htmlFor={`additional-image-${product.id}-${imgIndex}`}
                                className={`flex flex-col items-center justify-center h-20 border-2 border-dashed border-muted-foreground/30 rounded-md cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                              >
                                {isUploading ? (
                                  <>
                                    <Loader2 className="h-5 w-5 mb-1 text-primary animate-spin" />
                                    <span className="text-xs text-muted-foreground/70">{progress}%</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-5 w-5 mb-1 text-muted-foreground/70" />
                                    <span className="text-xs text-muted-foreground/70">Adicionar</span>
                                  </>
                                )}
                                <Input
                                  id={`additional-image-${product.id}-${imgIndex}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleAdditionalImageUpload(product.id, imgIndex, e)}
                                  className="hidden"
                                  disabled={isUploading}
                                />
                              </label>
                              {isUploading && (
                                <div className="mt-1">
                                  <Progress value={progress} className="h-1" />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatFileSize(size)}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Adicione até 3 imagens secundárias do produto (máx. 5MB cada)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
          
          <div className="flex justify-end">
            <Button className="bg-primary text-white" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProducts;
