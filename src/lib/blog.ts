export interface Post {
  id: string;
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  date: string;
}

export const blogPosts: Post[] = [
  {
    id: '1',
    slug: '2026-europe-heatwave-efficiency',
    date: '2026-07-13',
    title: {
      en: 'Maximizing Energy Efficiency During the July 2026 European Heatwave',
      fr: "Maximiser l'efficacite energetique pendant la canicule europeenne de juillet 2026",
      de: 'Maximierung der Energieeffizienz wahrend der europaischen Hitzewelle im Juli 2026'
    },
    excerpt: {
      en: 'Learn how to stay cool in France and the UK without skyrocketing your energy bills.',
      fr: "Decouvrez comment rester au frais en France sans faire exploser vos factures d'energie.",
      de: 'Erfahren Sie, wie Sie in Deutschland und Grossbritannien kuhl bleiben, ohne Ihre Stromrechnung in die Hohe zu treiben.'
    },
    content: {
      en: "As temperatures soar across France and the UK this July 2026, reaching record highs of 40C in some regions, the demand for residential cooling has reached an all-time high. CoolZone's Arctic Breeze 9000 series, with its A++ energy rating, is specifically engineered for these extreme conditions. By utilizing advanced inverter technology, it reduces energy consumption by up to 40% compared to non-inverter models.",
      fr: "Alors que les temperatures s'envolent en France ce mois de juillet 2026, atteignant des records de 40C dans certaines regions, la demande de climatisation residentielle a atteint un niveau historique. La serie Arctic Breeze 9000 de CoolZone, avec son classement energetique A++, est specifiquement concue pour ces conditions extremes. Grace a une technologie d'onduleur avancee, elle reduit la consommation d'energie jusqu'a 40 % par rapport aux modeles classiques.",
      de: 'Da die Temperaturen im Juli 2026 in ganz Deutschland in die Hohe schnellen, ist die Nachfrage nach Kuhlung so hoch wie nie zuvor. Die Arctic Breeze 9000-Serie von CoolZone bietet zuverlassigen Schutz.'
    }
  },
  {
    id: '2',
    slug: 'europe-heat-pump-subsidies-2026',
    date: '2026-07-14',
    title: {
      en: 'How to Get 2026 EU Subsidies for Your New Air Conditioner',
      fr: "Comment obtenir des subventions de l'UE in 2026 pour votre nouveau climatiseur",
      de: 'So erhalten Sie 2026 EU-Fordermittel fur Ihre neue Klimaanlage'
    },
    excerpt: {
      en: 'Major EU countries are offering up to 1700 euros in incentives for energy-efficient systems.',
      fr: "Les principaux pays de l'UE offrent jusqu'a 1 700 euros d'incitation.",
      de: 'Wichtige EU-Lander bieten Anreize von bis zu 1.700 Euro.'
    },
    content: {
      en: 'In 2026, the European Union has accelerated its transition to sustainable cooling. Homeowners in France can now access up to 1700 euros in grants for reversible heat pumps like the CoolZone Glacier series.',
      fr: "En 2026, l'Union europeenne a accelere sa transition vers un refroidissement durable. Les proprietaires en France peuvent desormais acceder a des subventions allant jusqu'a 1 700 euros.",
      de: 'Im Jahr 2026 hat die Europaische Union ihren Ubergang zu nachhaltiger Kuhlung beschleunigt. Hausbesitzer in Deutschland erhalten erhebliche Zuschusse.'
    }
  }
];
