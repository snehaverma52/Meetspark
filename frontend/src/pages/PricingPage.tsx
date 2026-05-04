import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Lite",
    price: "$0",
    inr: "₹0",
    period: "forever",
    icon: Sparkles,
    description: "Get started with 3 free uploads",
    features: ["3 video uploads", "AI summaries", "Basic transcript", "7-day history"],
    cta: "Current Plan",
    popular: false,
    disabled: true,
  },
  {
    name: "Prime",
    price: "$19",
    inr: "₹199",
    period: "/month",
    icon: Zap,
    description: "Unlock full AI power, Unlimited summaries + PDF exports",
    features: ["Unlimited uploads", "AI summaries + action items", "PDF export", "30-day history", "Priority processing"],
    cta: "Go Prime",
    popular: true,
    disabled: false,
  },
  {
    name: "Elite",
    price: "$49",
    inr: "₹499",
    period: "/month",
    icon: Users,
    description: "For teams and power users",
    features: ["Everything in Prime", "Up to 10 team members", "Shared workspace", "Unlimited history", "Admin dashboard", "SSO support"],
    cta: "Go Elite",
    popular: false,
    disabled: false,
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function PricingPage() {
  const { trialCount = 0 } = useAuth() as any;

  // 🔥 STEP 6: PAYMENT FUNCTION
  const handlePayment = async (amount: number, plan: string) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      if (!order || !order.id) {
        alert("Order creation failed ❌");
        return;
      }

      const options = {
        key: "rzp_live_SdM6E1RYfMOQOT", // 🔑 replace this
        amount: order.amount,
        currency: "INR",
        name: "MeetSum AI",
        description: plan,
        order_id: order.id,

        handler: function (response: any) {
          alert("Payment Successful 🎉");
          console.log(response);
        },

        theme: {
          color: "#6366f1",
        },
      };

      if (!(window as any).Razorpay) {
        alert("Razorpay SDK not loaded ❌");
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-foreground">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
         Choose the plan that fits your needs and unlock the full potential of MeetSum AI. Whether you're just starting out or need advanced features for your team, we've got you covered.
        </p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={item}
            className={`glass-card p-6 flex flex-col relative ${
              plan.popular ? "gradient-border" : ""
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <plan.icon className="w-5 h-5 text-primary" />
            </div>

            <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>

            <div className="mt-2 mb-1">
              <div className="flex flex-col">
               <span className="text-3xl font-bold text-foreground">
                     {plan.price}
                   </span>
                   <span className="text-sm text-muted-foreground">
                      {plan.inr} {plan.period}
                   </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>

            {/* 🔥 STEP 7: BUTTON CLICK */}
            <button
              disabled={plan.disabled}
              onClick={() =>{
                if (plan.name === "Prime") {
                  handlePayment(199, "Prime Plan");
                } else if (plan.name === "Elite") {
                  handlePayment(499, "Elite Plan");
                }
              }}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                plan.popular
                  ? "btn-primary"
                  : plan.disabled
                  ? "bg-secondary text-muted-foreground cursor-not-allowed"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}