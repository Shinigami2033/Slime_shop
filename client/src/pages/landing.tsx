import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertNewsletterSchema, type InsertNewsletter } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, Star, Sparkles, Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const newsletterSchema = insertNewsletterSchema;
type NewsletterFormData = InsertNewsletter;

const products = [
  {
    id: 1,
    name: "Galaxy Green",
    description: "Mesmerizing green slime with holographic glitter that sparkles like stars in the night sky. Perfect for stress relief and endless stretching fun!",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-green-50 to-green-100",
    priceColor: "text-green-600"
  },
  {
    id: 2,
    name: "Mystic Purple",
    description: "Smooth butter slime with an enchanting purple hue that feels like silk in your hands. Includes lavender scent for ultimate relaxation.",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-purple-50 to-purple-100",
    priceColor: "text-purple-600"
  },
  {
    id: 3,
    name: "Bubblegum Pink",
    description: "Fluffy cloud slime with mini foam beads that create the most satisfying crunchy texture. Sweet bubblegum scent that's absolutely irresistible!",
    price: "$13.99",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-pink-50 to-pink-100",
    priceColor: "text-pink-600"
  }
];

export default function Landing() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [subscriberCount] = useState(500);
  const { toast } = useToast();

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const newsletterMutation = useMutation({
    mutationFn: (data: NewsletterFormData) => apiRequest("/api/newsletter", "POST", data),
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Success!",
        description: "You've been added to our newsletter list.",
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    },
    onError: (error: any) => {
      console.error("Newsletter signup error:", error);
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewsletterFormData) => {
    newsletterMutation.mutate(data);
  };



  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-green-100">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-purple-500 rounded-full animate-pulse-slow"></div>
              <span className="text-2xl font-display text-gray-800">SlimeShop</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection('products')}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection('newsletter')}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Newsletter
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-purple-500/20 to-pink-500/20"></div>
        
        {/* Floating slime blobs */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-500/30 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500/30 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-500/30 rounded-full animate-wiggle"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-display text-gray-800 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-purple-500 to-pink-500">
              Slime Shop
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-display text-purple-600 mb-8 animate-pulse-slow">
            Coming Soon!
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get ready for the most amazing, squishiest, and most colorful slime collection! 
            Our handcrafted slimes will bring endless fun and sensory satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => scrollToSection('products')}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Explore Products
            </Button>
            <Button 
              onClick={() => scrollToSection('newsletter')}
              variant="outline"
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              <Mail className="mr-2 h-5 w-5" />
              Get Notified
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-gray-800 mb-4">
              Featured <span className="text-purple-600">Slimes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of handcrafted slimes, each with unique textures and endless fun!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <Card key={product.id} className={`bg-gradient-to-br ${product.color} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group border-0`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-display text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${product.priceColor}`}>{product.price}</span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Coming Soon
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-20 bg-gradient-to-r from-green-500/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display text-gray-800 mb-6">
              Stay in the <span className="text-purple-600">Loop</span>!
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Be the first to know when our amazing slimes are available! Get exclusive updates, 
              early access, and special discounts.
            </p>

            <Card className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-auto border-0">
              <CardContent className="p-0">
                {!isSubmitted ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        disabled={newsletterMutation.isPending}
                      >
                        <Heart className="mr-2 h-5 w-5" />
                        {newsletterMutation.isPending ? "Subscribing..." : "Notify Me When Available! 🎉"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <h3 className="font-semibold text-green-800">Thanks for your interest!</h3>
                        <p className="text-green-700">We'll be in touch with exciting updates soon!</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Join <span className="font-semibold text-purple-600">{subscriberCount}+</span> slime enthusiasts already waiting!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-purple-500 rounded-full"></div>
                <span className="text-2xl font-display">SlimeShop</span>
              </div>
              <p className="text-gray-400 mb-4">
                Creating the most amazing, high-quality slimes for endless fun and sensory satisfaction. 
                Handcrafted with love and the finest ingredients.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-green-400 transition-colors">
                  <Star className="w-6 h-6" />
                </button>
                <button className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="text-gray-400 hover:text-pink-400 transition-colors">
                  <Sparkles className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-display text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('products')} className="hover:text-white transition-colors">Products</button></li>
                <li><button onClick={() => scrollToSection('newsletter')} className="hover:text-white transition-colors">Newsletter</button></li>
                <li><button className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display text-lg mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">Instagram</button></li>
                <li><button className="hover:text-white transition-colors">TikTok</button></li>
                <li><button className="hover:text-white transition-colors">YouTube</button></li>
                <li><button className="hover:text-white transition-colors">Pinterest</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col sm:flex-row justify-center items-center">
              <p className="text-gray-400 text-center">
                &copy; 2024 SlimeShop. All rights reserved. Made with 💜 for slime lovers everywhere.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
