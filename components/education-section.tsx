"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import educationData from "@/data/education.json"
import achievementsData from "@/data/achievements.json"

export function EducationSection() {
  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Education & Achievements
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Academic journey and notable accomplishments</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-cyan-400" />
              Education
            </h3>

            <div className="space-y-6">
              {educationData.education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="group relative"
                >
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {edu.degree}
                        </h4>
                        <p className="text-cyan-400 font-medium">{edu.institution}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          edu.status === "current"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/50 font-bold"
                            : edu.status === "ongoing"
                            ? "bg-blue-500/20 text-blue-400 border-blue-400/50"
                            : "bg-green-500/20 text-green-400 border-green-400/50"
                        }
                      >
                        {edu.status === "current"
                          ? "Current"
                          : edu.status === "ongoing"
                          ? "Ongoing"
                          : "Completed"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {edu.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        CGPA: {edu.cgpa}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">{edu.description}</p>

                    {/* Progress Bar for CGPA */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>CGPA Progress</span>
                        <span>{edu.cgpa}/10.0</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(Number.parseFloat(edu.cgpa) / 10) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements & Certifications */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-400" />
              Achievements & Certifications
            </h3>

            <div className="space-y-6">
              {achievementsData.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  className="group"
                >
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {achievement.title}
                        </h4>
                        <p className="text-purple-400 font-medium mb-2">{achievement.issuer}</p>
                        {achievement.description && (
                          <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {achievement.type}
                          </Badge>
                          <span className="text-gray-400 text-xs">{achievement.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Responsibilities */}
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-white mb-4">Roles of Responsibility</h4>
                <div className="space-y-4">
                  {achievementsData.responsibilities.map((role, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 hover:border-cyan-400/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-white">{role.position}</h5>
                        <span className="text-xs text-gray-400">{role.duration}</span>
                      </div>
                      <p className="text-cyan-400 text-sm mb-2">{role.organization}</p>
                      <p className="text-gray-300 text-sm">{role.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
