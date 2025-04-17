"use client";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";



export default function Home() {
const router = useRouter()
const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "100% Anonymous",
    description: "Your identity remains completely private. Share without fear.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Supportive Community",
    description: "Find understanding and acceptance in our safe space.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Connect Genuinely",
    description: "Build real connections without judgement or prejudice.",
  },
];

  const handelClick = () => {
    try {
      router.push('/sign-in')
    } catch (error) {
      console.log("error redirecting to sign in" , error);
      
    }
  }
  return (
    <>
    <div className="min-h-[80vh] flex justify-center items-center flex-col bg-gray-100">
      <h1 className="text-7xl font-bold text-center ">Confess Your  CONFESSIONS</h1>
      <h2 className="p-6 text-2xl text-center">A safe space to express yourself anonymously. <br />Connect, share, and discover stories from people around the world.</h2>
      <Button onClick={handelClick}> <MessageCircle/> Start Confessing </Button>
    </div>

    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Confessions?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the freedom of anonymous expression in a secure and supportive environment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="py-16 bg-gradient-to-br bg-gray-100 ">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Share Your Story?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of others who have found their voice in anonymity.
        </p>
        <Button onClick={handelClick}>
          Get started now
        </Button>
      </div>
    </div>
    </>
  );
}
