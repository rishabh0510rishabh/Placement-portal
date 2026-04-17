"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bookmark, Map, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const roadmapsData = [
  {
    category: "Role Based Roadmaps",
    items: [
      { name: "Frontend", link: "https://roadmap.sh/pdfs/roadmaps/frontend.pdf" },
      { name: "Backend", link: "https://roadmap.sh/pdfs/roadmaps/backend.pdf" },
      { name: "Full Stack", link: "https://roadmap.sh/pdfs/roadmaps/full-stack.pdf" },
      { name: "DevOps", link: "https://roadmap.sh/pdfs/roadmaps/devops.pdf" },
      { name: "DevSecOps", link: "https://roadmap.sh/pdfs/roadmaps/devsecops.pdf" },
      { name: "Data Analyst", link: "https://roadmap.sh/pdfs/roadmaps/data-analyst.pdf" },
      { name: "AI Engineer", link: "https://roadmap.sh/pdfs/roadmaps/ai-engineer.pdf" },
      { name: "AI and Data Scientist", link: "https://roadmap.sh/pdfs/roadmaps/ai-data-scientist.pdf" },
      { name: "Data Engineer", link: "https://roadmap.sh/pdfs/roadmaps/data-engineer.pdf" },
      { name: "Android", link: "https://roadmap.sh/pdfs/roadmaps/android.pdf" },
      { name: "Machine Learning", link: "https://roadmap.sh/pdfs/roadmaps/machine-learning.pdf" },
      { name: "PostgreSQL", link: "https://roadmap.sh/pdfs/roadmaps/postgresql.pdf" },
      { name: "iOS", link: "https://roadmap.sh/pdfs/roadmaps/ios.pdf" },
      { name: "Blockchain", link: "https://roadmap.sh/pdfs/roadmaps/blockchain.pdf" },
      { name: "QA", link: "https://roadmap.sh/pdfs/roadmaps/qa.pdf" },
      { name: "Software Architect", link: "https://roadmap.sh/pdfs/roadmaps/software-architect.pdf" },
      { name: "Cyber Security", link: "https://roadmap.sh/pdfs/roadmaps/cyber-security.pdf" },
      { name: "UX Design", link: "https://roadmap.sh/pdfs/roadmaps/ux-design.pdf" },
      { name: "Technical Writer", link: "https://roadmap.sh/pdfs/roadmaps/technical-writer.pdf" },
      { name: "Game Developer", link: "https://roadmap.sh/pdfs/roadmaps/game-developer.pdf" },
      { name: "Server Side Game Developer", link: "https://roadmap.sh/pdfs/roadmaps/server-side-game-developer.pdf" },
      { name: "MLOps", link: "https://roadmap.sh/pdfs/roadmaps/mlops.pdf" },
      { name: "Product Manager", link: "https://roadmap.sh/pdfs/roadmaps/product-manager.pdf" },
      { name: "Engineering Manager", link: "https://roadmap.sh/pdfs/roadmaps/engineering-manager.pdf" },
      { name: "Developer Relations", link: "https://roadmap.sh/pdfs/roadmaps/developer-relations.pdf" },
      { name: "BI Analyst", link: "https://roadmap.sh/pdfs/roadmaps/bi-analyst.pdf" }
    ]
  },
  {
    category: "Project Ideas",
    items: [
      { name: "Frontend Projects", link: "https://roadmap.sh/pdfs/roadmaps/frontend-projects.pdf" },
      { name: "Backend Projects", link: "https://roadmap.sh/pdfs/roadmaps/backend-projects.pdf" },
      { name: "DevOps Projects", link: "https://roadmap.sh/pdfs/roadmaps/devops-projects.pdf" }
    ]
  },
  {
    category: "Skill Based Roadmaps",
    items: [
      { name: "SQL", link: "https://roadmap.sh/pdfs/roadmaps/sql.pdf" },
      { name: "Computer Science", link: "https://roadmap.sh/pdfs/roadmaps/computer-science.pdf" },
      { name: "React", link: "https://roadmap.sh/pdfs/roadmaps/react.pdf" },
      { name: "Vue", link: "https://roadmap.sh/pdfs/roadmaps/vue.pdf" },
      { name: "Angular", link: "https://roadmap.sh/pdfs/roadmaps/angular.pdf" },
      { name: "JavaScript", link: "https://roadmap.sh/pdfs/roadmaps/javascript.pdf" },
      { name: "TypeScript", link: "https://roadmap.sh/pdfs/roadmaps/typescript.pdf" },
      { name: "Node.js", link: "https://roadmap.sh/pdfs/roadmaps/nodejs.pdf" },
      { name: "Python", link: "https://roadmap.sh/pdfs/roadmaps/python.pdf" },
      { name: "System Design", link: "https://roadmap.sh/pdfs/roadmaps/system-design.pdf" },
      { name: "Java", link: "https://roadmap.sh/pdfs/roadmaps/java.pdf" },
      { name: "ASP.NET Core", link: "https://roadmap.sh/pdfs/roadmaps/aspnet-core.pdf" },
      { name: "API Design", link: "https://roadmap.sh/pdfs/roadmaps/api-design.pdf" },
      { name: "Spring Boot", link: "https://roadmap.sh/pdfs/roadmaps/spring-boot.pdf" },
      { name: "Flutter", link: "https://roadmap.sh/pdfs/roadmaps/flutter.pdf" },
      { name: "C++", link: "https://roadmap.sh/pdfs/roadmaps/cpp.pdf" },
      { name: "Rust", link: "https://roadmap.sh/pdfs/roadmaps/rust.pdf" },
      { name: "Go", link: "https://roadmap.sh/pdfs/roadmaps/go.pdf" },
      { name: "Software Design and Architecture", link: "https://roadmap.sh/pdfs/roadmaps/software-design-architecture.pdf" },
      { name: "GraphQL", link: "https://roadmap.sh/pdfs/roadmaps/graphql.pdf" },
      { name: "React Native", link: "https://roadmap.sh/pdfs/roadmaps/react-native.pdf" },
      { name: "Design System", link: "https://roadmap.sh/pdfs/roadmaps/design-system.pdf" },
      { name: "Prompt Engineering", link: "https://roadmap.sh/pdfs/roadmaps/prompt-engineering.pdf" },
      { name: "MongoDB", link: "https://roadmap.sh/pdfs/roadmaps/mongodb.pdf" },
      { name: "Linux", link: "https://roadmap.sh/pdfs/roadmaps/linux.pdf" },
      { name: "Kubernetes", link: "https://roadmap.sh/pdfs/roadmaps/kubernetes.pdf" },
      { name: "Docker", link: "https://roadmap.sh/pdfs/roadmaps/docker.pdf" },
      { name: "AWS", link: "https://roadmap.sh/pdfs/roadmaps/aws.pdf" },
      { name: "Terraform", link: "https://roadmap.sh/pdfs/roadmaps/terraform.pdf" },
      { name: "Data Structures and Algorithms", link: "https://roadmap.sh/pdfs/roadmaps/dsa.pdf" },
      { name: "Redis", link: "https://roadmap.sh/pdfs/roadmaps/redis.pdf" },
      { name: "Git and GitHub", link: "https://roadmap.sh/pdfs/roadmaps/git-github.pdf" },
      { name: "PHP", link: "https://roadmap.sh/pdfs/roadmaps/php.pdf" },
      { name: "Cloudflare", link: "https://roadmap.sh/pdfs/roadmaps/cloudflare.pdf" },
      { name: "AI Red Teaming", link: "https://roadmap.sh/pdfs/roadmaps/ai-red-teaming.pdf" },
      { name: "AI Agents", link: "https://roadmap.sh/pdfs/roadmaps/ai-agents.pdf" },
      { name: "Next.js", link: "https://roadmap.sh/pdfs/roadmaps/nextjs.pdf" },
      { name: "Code Review", link: "https://roadmap.sh/pdfs/roadmaps/code-review.pdf" },
      { name: "Kotlin", link: "https://roadmap.sh/pdfs/roadmaps/kotlin.pdf" },
      { name: "HTML", link: "https://roadmap.sh/pdfs/roadmaps/html.pdf" },
      { name: "CSS", link: "https://roadmap.sh/pdfs/roadmaps/css.pdf" },
      { name: "Swift & SwiftUI", link: "https://roadmap.sh/pdfs/roadmaps/swift-swiftui.pdf" },
      { name: "Shell / Bash", link: "https://roadmap.sh/pdfs/roadmaps/bash.pdf" },
      { name: "Laravel", link: "https://roadmap.sh/pdfs/roadmaps/laravel.pdf" },
      { name: "Elasticsearch", link: "https://roadmap.sh/pdfs/roadmaps/elasticsearch.pdf" },
      { name: "WordPress", link: "https://roadmap.sh/pdfs/roadmaps/wordpress.pdf" },
      { name: "Django", link: "https://roadmap.sh/pdfs/roadmaps/django.pdf" },
      { name: "Ruby", link: "https://roadmap.sh/pdfs/roadmaps/ruby.pdf" },
      { name: "Ruby on Rails", link: "https://roadmap.sh/pdfs/roadmaps/ruby-on-rails.pdf" },
      { name: "Claude Code", link: "https://roadmap.sh/pdfs/roadmaps/claude-code.pdf" },
      { name: "Vibe Coding", link: "https://roadmap.sh/pdfs/roadmaps/vibe-coding.pdf" },
      { name: "Scala", link: "https://roadmap.sh/pdfs/roadmaps/scala.pdf" },
      { name: "OpenClaw", link: "https://roadmap.sh/pdfs/roadmaps/openclaw.pdf" }
    ]
  }
];

export default function RoadmapsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRoadmapsData = useMemo(() => {
    if (!searchQuery.trim()) return roadmapsData

    return roadmapsData.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.items.length > 0)
  }, [searchQuery])

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Roadmaps</h1>
        <p className="text-muted-foreground mt-1">Explore different role-based and skill-based learning paths.</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roadmaps..."
              className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-10">
        {filteredRoadmapsData.length === 0 ? (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 opacity-40">
              <Map className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">No roadmaps found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRoadmapsData.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              {section.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((roadmap, i) => (
                <Card 
                  key={i} 
                  className="bg-card border-border hover:border-primary/20 transition-all group relative overflow-hidden cursor-pointer" 
                  onClick={() => window.open(roadmap.link, '_blank')}
                >
                  <CardHeader className="pb-4 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black border border-white/5 transition-transform group-hover:scale-110">
                        <Bookmark className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold tracking-tight">{roadmap.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )))}
      </div>
    </div>
  )
}
