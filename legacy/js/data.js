const mockData = {
    currentUser: {
        name: "Akim",
        role: "Administrador",
        avatarInitial: "A"
    },
    summary: {
        totalClients: {
            value: 35,
            growth: "+12 este mês"
        },
        servicesToday: {
            value: 8,
            status: "3 em andamento"
        },
        monthlyBilling: {
            value: "R$ 6.750,00",
            growth: "+15% vs mês anterior"
        },
        lastMonthBilling: {
            value: "R$ 5.737,50",
            growth: "+5% vs mês de fevereiro"
        }
    },
    clients: [
        { id: 1, name: "Carlos Mendes", vehicle: "Audi A4", lastVisit: "2 dias atrás", initials: "CM", color: "#9381FF" },
        { id: 2, name: "Ana Paula", vehicle: "BMW X6", lastVisit: "5 dias atrás", initials: "AP", color: "#FFB0B0" },
        { id: 3, name: "João Fernandes", vehicle: "Golf GTI", lastVisit: "6 dias atrás", initials: "JF", color: "#B8B8B8" },
        { id: 4, name: "Airton Yamaha", vehicle: "Honda HRV", lastVisit: "8 dias atrás", initials: "AY", color: "#6FCF97" },
        { id: 5, name: "Heitor Gomes", vehicle: "Jeep Compass", lastVisit: "10 dias atrás", initials: "HG", color: "#F2C94C" },
        { id: 6, name: "Karol Lemes", vehicle: "Hyundai Creta", lastVisit: "10 dias atrás", initials: "KL", color: "#56CCF2" }
    ],
    services: [
        { id: 1, client: "Carlos Mendes", vehicle: "Audi A4", type: "Higienização", time: "08:00", status: "Em andamento" },
        { id: 2, client: "Ana Paula", vehicle: "BMW X6", type: "Lavagem Completa", time: "09:00", status: "Agendado" },
        { id: 3, client: "João Fernandes", vehicle: "Golf GTI", type: "Lavagem Completa", time: "09:30", status: "Agendado" },
        { id: 4, client: "Airton Yamaha", vehicle: "Honda HRV", type: "Lavagem Simples", time: "13:00", status: "Agendado" },
        { id: 5, client: "Heitor Gomes", vehicle: "Jeep Compass", type: "Higienização", time: "14:00", status: "Agendado" },
        { id: 6, client: "Karol Lemes", vehicle: "Hyundai Creta", type: "Lavagem Completa", time: "16:00", status: "Agendado" }
    ],
    billingChart: [
        { month: "Jan", value: 120, color: "#2B2D62" },
        { month: "Fev", value: 115, color: "#3A3D7F" },
        { month: "Mar", value: 140, color: "#4A4D9C" },
        { month: "Abr", value: 155, color: "#5A5DB9" },
        { month: "Mai", value: 160, color: "#6A6DD6" },
        { month: "Jun", value: 145, color: "#4AC6B7" },
        { month: "Jul", value: 175, color: "#3FB1A4" },
        { month: "Ago", value: 190, color: "#349C91" },
        { month: "Set", value: 215, color: "#29877E" },
        { month: "Out", value: 240, color: "#66CC66" },
        { month: "Nov", value: 270, color: "#77DD77" },
        { month: "Dez", value: 310, color: "#88EE88" }
    ]
};
