import React, { useEffect } from 'react';
import { Code2, Server, Database, Palette, Github, Lightbulb } from 'lucide-react';
import { GlassCard } from './GlassContainer';
import { Typography } from "@material-tailwind/react";
import { useUserSkillStore } from '../../../../OrchestraLayer/StateManager/Zustand/userProfileStore';

// const skills = [
//     { name: "React.js", desc: "Building dynamic user interfaces with reusable components and hooks.", icon: <Code2 />, color: "text-blue-600" },
//     { name: "Node.js & Express", desc: "Creating fast and scalable backend APIs with RESTful architecture.", icon: <Server />, color: "text-green-600" },
//     { name: "MySQL", desc: "Designing and managing relational databases for web applications.", icon: <Database />, color: "text-yellow-600" },
//     { name: "Tailwind CSS", desc: "Crafting beautiful, responsive designs using utility-first classes.", icon: <Palette />, color: "text-pink-600" },
//     { name: "Git & GitHub", desc: "Version control and team collaboration with Git best practices.", icon: <Github />, color: "text-purple-600" },
//     { name: "Problem Solving", desc: "Strong ability to debug, optimize code, and solve real-world problems.", icon: <Lightbulb />, color: "text-red-500" },
// ];
const skillIcons = {
    "React.js": <Code2 />,
    "Node.js & Express": <Server />,
    "MySQL": <Database />,
    "Tailwind CSS": <Palette />,
    "Git & GitHub": <Github />,
    "Problem Solving": <Lightbulb />,
};
const categoryColor = {
    "Dev": "blue-500",
    "SoftSkill": "green-500",
    "Language": "red-500",
}
const SkillPage = () => {
    const useSkillStore = useUserSkillStore();


    var skills = useSkillStore.value;
    console.log("Skills: ", skills);
    return (
        <section className="bg-transparent py-8 md:p-8 animate-fade-in-up">
            <div className="max-w-6xl mx-auto">
                <GlassCard className="p-8 mb-8 text-center bg-white/30">
                    <Typography
                        variant="h2"
                        className="text-3xl md:text-4xl font-extrabold text-white mb-2"
                        placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} onResize={() => { }} onResizeCapture={() => { }}
                    >
                        Professional Skills
                    </Typography>
                    <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
                </GlassCard>

                <div className="grid gap-6  sm:grid-cols-2 lg:grid-cols-3">
                    {skills.map((skill, index) => (
                        <GlassCard
                            key={index}
                            className={` text-white transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg group`}
                        >
                            <div className={`mb-4 border-2 border-${categoryColor[skill.category]} shadow-sm  rounded-xl w-full  p-6 h-full`}>


                                <div className={`mb-4 inline-block p-3 rounded-xl bg-${categoryColor[skill.category]} shadow-sm group-hover:scale-110 transition-transform `}>
                                    {skillIcons[skill.name]}
                                </div>
                                <Typography
                                    variant="h5"
                                    className="font-bold text-white mb-2"
                                    placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} onResize={() => { }} onResizeCapture={() => { }}
                                >
                                    {skill.name}
                                </Typography>
                                <Typography
                                    className="text-white leading-relaxed text-sm"
                                    placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} onResize={() => { }} onResizeCapture={() => { }}
                                >
                                    {skill.description}
                                </Typography>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillPage;