import React, { useState, useEffect } from "react";
import { Investigation, EntityProfile } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Activity, 
  Search, 
  TrendingUp, 
  Shield, 
  Eye,
  Network,
  Image,
  Database,
  AlertCircle,
  Plus,
  ArrowRight,
  Globe,
  Users,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [investigations, setInvestigations] = useState([]);
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const [investigationData, entityData] = await Promise.all([
      Investigation.list('-created_date', 5),
      EntityProfile.list('-created_date', 10)
    ]);
    setInvestigations(investigationData);
    setEntities(entityData);
    setIsLoading(false);
  };

  const statsCards = [
    {
      title: "Active Investigations",
      value: investigations.filter(i => i.status === 'active').length,
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      trend: "+12% this week"
    },
    {
      title: "Entity Profiles",
      value: entities.length,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      trend: "+8 new today"
    },
    {
      title: "Data Sources",
      value: "47",
      icon: Database,
      color: "from-green-500 to-green-600",
      trend: "99.2% uptime"
    },
    {
      title: "Threat Level",
      value: "LOW",
      icon: Shield,
      color: "from-orange-500 to-orange-600",
      trend: "No alerts"
    }
  ];

  const quickActions = [
    {
      title: "New Entity Search",
      description: "Start investigating a new target",
      icon: Search,
      href: createPageUrl("EntitySearch"),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Create Investigation",
      description: "Begin a new case file",
      icon: Plus,
      href: createPageUrl("Investigations"),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Image Analysis",
      description: "Analyze media files",
      icon: Image,
      href: createPageUrl("ImageAnalysis"),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Network Scan",
      description: "Infrastructure reconnaissance",
      icon: Network,
      href: createPageUrl("NetworkIntel"),
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Intelligence Dashboard</h1>
            <p className="text-gray-400">Comprehensive OSINT operations center</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Legal Compliance Mode Active</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br ${stat.color} rounded-full opacity-10`} />
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                      <CardTitle className="text-2xl md:text-3xl font-bold text-white mt-2">
                        {stat.value}
                      </CardTitle>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                    <span className="text-green-400 font-medium">{stat.trend}</span>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={action.href}>
                    <Button className={`w-full h-auto p-4 ${action.color} flex-col items-start text-left`}>
                      <div className="flex items-center justify-between w-full mb-2">
                        <action.icon className="w-5 h-5" />
                        <ArrowRight className="w-4 h-4 opacity-70" />
                      </div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-xs opacity-80">{action.description}</p>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Investigations */}
          <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Investigations
              </CardTitle>
              <Link to={createPageUrl("Investigations")}>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investigations.slice(0, 5).map((investigation) => (
                  <div key={investigation.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{investigation.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{investigation.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={`text-xs ${
                          investigation.status === 'active' ? 'text-green-400 border-green-500' :
                          investigation.status === 'completed' ? 'text-blue-400 border-blue-500' :
                          'text-gray-400 border-gray-500'
                        }`}>
                          {investigation.status}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${
                          investigation.priority === 'high' ? 'text-red-400 border-red-500' :
                          investigation.priority === 'medium' ? 'text-yellow-400 border-yellow-500' :
                          'text-gray-400 border-gray-500'
                        }`}>
                          {investigation.priority}
                        </Badge>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
                {investigations.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No investigations yet</p>
                    <Link to={createPageUrl("Investigations")}>
                      <Button variant="outline" className="mt-3">Create Your First Investigation</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Entity Intelligence */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Recent Entities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entities.slice(0, 6).map((entity) => (
                  <div key={entity.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{entity.identifier}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {entity.type}
                        </Badge>
                        {entity.related_entities && entity.related_entities.length > 0 && (
                          <span className="text-xs text-gray-400">
                            +{entity.related_entities.length} linked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {entities.length === 0 && (
                  <div className="text-center py-6">
                    <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No entities analyzed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
