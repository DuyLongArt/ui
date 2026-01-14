import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { GlassCard } from "./GlassContainer";

const ProjectPage = () => {
    const recentProjects = [
        {
            title: "Smart Home IoT",
            status: "Active",
            description: "A .NET integrated dashboard to control eWeLink devices via MQTT.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
        },
        // ... more projects
    ];

    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    return (
        <GlassCard>


            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-12">
                <Typography variant="h3" className="mb-8 text-white font-extrabold text-center" {...commonProps}>
                    Recent Projects
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentProjects.map((project, index) => (
                        <Card key={index} className={`overflow-hidden flex flex-col`} {...commonProps}>
                            {/* Image Overlay Gradient */}
                            <div className="h-52 overflow-hidden relative group">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>

                            <CardBody className="p-6" {...commonProps}>
                                <div className="flex justify-between items-center mb-3">
                                    <Typography variant="h5" className="text-white font-bold" {...commonProps}>
                                        {project.title}
                                    </Typography>
                                    <span className="text-indigo-600">
                                        {project.status}
                                    </span>
                                </div>

                                <Typography className="text-white text-sm leading-relaxed mb-4" {...commonProps}>
                                    {project.description}
                                </Typography>

                                <div className="flex gap-2">
                                    <Button size="sm" variant="text" className="flex items-center gap-2 text-indigo-600" {...commonProps}>
                                        View Demo
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
};
export default ProjectPage;