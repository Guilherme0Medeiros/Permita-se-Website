import { motion } from "framer-motion";
import { Instagram, MessageCircle, Mail, Clock, Truck, RefreshCw } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
};

const infos = [
  { icon: Clock, title: "Atendimento", lines: ["Seg a Sex: 9h–18h", "Sábado: 9h–14h"] },
  { icon: Truck, title: "Entrega", lines: ["Frete grátis acima de R$ 199", "Todo o Brasil"] },
  { icon: RefreshCw, title: "Trocas", lines: ["30 dias para troca", "1ª troca grátis"] },
];

const socials = [
  { icon: Instagram, label: "Instagram", desc: "Looks e inspirações", link: "#", cta: "@permitase" },
  { icon: MessageCircle, label: "WhatsApp", desc: "Atendimento personalizado", link: "#", cta: "Falar Conosco" },
  { icon: Mail, label: "E-mail", desc: "Parcerias e colaborações", link: "#", cta: "Enviar E-mail" },
];

export default function StoreFooter() {
  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      {/* Contact Section */}
      <motion.section
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tighter">
              Fique Conectado
            </h2>
            <p className="mt-3 text-surface-dark-foreground/60 text-lg">
              Siga-nos e fique por dentro de todas as novidades
            </p>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.link}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center p-8 rounded-2xl bg-surface-dark-foreground/5 hover:bg-surface-dark-foreground/10 transition-colors text-center"
              >
                <s.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-1">{s.label}</h3>
                <p className="text-surface-dark-foreground/50 text-sm mb-4">{s.desc}</p>
                <span className="text-primary font-semibold text-sm">{s.cta}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Info grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-surface-dark-foreground/10">
            {infos.map((info) => (
              <motion.div key={info.title} variants={itemVariants} className="text-center">
                <info.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <h4 className="font-bold text-sm mb-1">{info.title}</h4>
                {info.lines.map((line) => (
                  <p key={line} className="text-xs text-surface-dark-foreground/50">{line}</p>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Bottom bar */}
      <div className="border-t border-surface-dark-foreground/10 px-4 py-6 text-center">
        <p className="text-xs text-surface-dark-foreground/40">
          © 2025 Permita-se — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
