import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartSidebar from "@/components/cart/CartSidebar";
import burgerImage from "@/assets/food-burger.jpg";
import saladImage from "@/assets/food-salad.jpg";
import pizzaImage from "@/assets/food-pizza.jpg";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dietary: string[];
  popular?: boolean;
}

const Menu = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Gourmet Burger",
      description: "Premium beef patty with artisanal cheese, crispy bacon, and fresh vegetables on a brioche bun",
      price: 18.99,
      image: burgerImage,
      category: "Mains",
      dietary: ["Gluten-Free Available"],
      popular: true,
    },
    {
      id: "2", 
      name: "Garden Fresh Salad",
      description: "Mixed greens, cherry tomatoes, cucumber, avocado, and feta cheese with house vinaigrette",
      price: 14.99,
      image: saladImage,
      category: "Salads",
      dietary: ["Vegetarian", "Gluten-Free"],
    },
    {
      id: "3",
      name: "Wood-Fired Pizza",
      description: "Authentic Italian pizza with fresh mozzarella, basil, and San Marzano tomatoes",
      price: 22.99,
      image: pizzaImage,
      category: "Mains",
      dietary: ["Vegetarian"],
      popular: true,
    },
    {
      id: "4",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon herb butter, served with seasonal vegetables",
      price: 26.99,
      image: pizzaImage, // Using placeholder image
      category: "Mains",
      dietary: ["Gluten-Free", "Keto-Friendly"],
      popular: true,
    },
    {
      id: "5",
      name: "Chicken Caesar Wrap",
      description: "Grilled chicken, romaine lettuce, parmesan cheese, and Caesar dressing in a tortilla wrap",
      price: 16.99,
      image: burgerImage, // Using placeholder image
      category: "Mains",
      dietary: ["High-Protein"],
    },
    {
      id: "6",
      name: "Mushroom Risotto",
      description: "Creamy arborio rice with wild mushrooms, truffle oil, and fresh herbs",
      price: 19.99,
      image: saladImage, // Using placeholder image
      category: "Mains",
      dietary: ["Vegetarian", "Gluten-Free"],
    },
    {
      id: "7",
      name: "Greek Salad",
      description: "Fresh tomatoes, cucumber, olives, red onion, and feta cheese with olive oil dressing",
      price: 12.99,
      image: saladImage,
      category: "Salads",
      dietary: ["Vegetarian", "Gluten-Free"],
    },
    {
      id: "8",
      name: "BBQ Ribs",
      description: "Slow-cooked pork ribs with our signature BBQ sauce, served with coleslaw",
      price: 24.99,
      image: burgerImage, // Using placeholder image
      category: "Mains",
      dietary: ["Gluten-Free"],
      popular: true,
    },
    {
      id: "9",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      price: 8.99,
      image: pizzaImage, // Using placeholder image
      category: "Desserts",
      dietary: ["Vegetarian"],
    },
    {
      id: "10",
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
      price: 7.99,
      image: saladImage, // Using placeholder image
      category: "Desserts",
      dietary: ["Vegetarian"],
    },
    {
      id: "11",
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice",
      price: 4.99,
      image: burgerImage, // Using placeholder image
      category: "Beverages",
      dietary: ["Vegan", "Gluten-Free"],
    },
    {
      id: "12",
      name: "Espresso",
      description: "Rich and bold Italian espresso",
      price: 3.99,
      image: pizzaImage, // Using placeholder image
      category: "Beverages",
      dietary: ["Vegan", "Gluten-Free"],
    },
  ];

  const categories = ["All", "Mains", "Salads", "Desserts", "Beverages"];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  const clearCart = () => {
    setCart({});
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, count]) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item ? item.price * count : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Our Menu</h1>
                <p className="text-sm text-muted-foreground">Fresh ingredients, crafted with care</p>
              </div>
            </div>
            
            <CartSidebar
              cart={cart}
              menuItems={menuItems}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onClearCart={clearCart}
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                {item.popular && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <CardDescription className="mt-2 text-base">{item.description}</CardDescription>
                  </div>
                  <div className="text-2xl font-bold text-primary">${item.price}</div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.dietary.map((diet) => (
                    <Badge key={diet} variant="secondary" className="text-xs">
                      {diet}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  {cart[item.id] ? (
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {cart[item.id]}
                      </span>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => addToCart(item.id)}
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="hero"
                      onClick={() => addToCart(item.id)}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Menu;