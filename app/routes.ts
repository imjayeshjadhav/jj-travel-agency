import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    layout('routes/admin/admin-layout.tsx',[
    route('dashboard','routes/admin/Dashboard.tsx'),
    route('all-users','routes/admin/all-users.tsx')
]),
] satisfies RouteConfig;