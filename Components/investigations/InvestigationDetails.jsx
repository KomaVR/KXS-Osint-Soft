import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Edit, 
  Clock, 
  User, 
  Target, 
  FileText,
  AlertTriangle,
  Plus,
  Eye,
  Network,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function InvestigationDetails({ investigation, onBack, onUpdate }) {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-500 bg-green-500/10';
      case 'paused': return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
      case 'completed': return 'text-blue-400 border-blue-500 bg-blue-500/10';
      case 'archived': return 'text-gray-400 border-gray-500 bg-gray-500/10';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 border-red-500 bg-red-500/10';
      case 'high': return 'text-orange-400 border-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-400 border-green-500 bg-green-500/10';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const handleStatusUpdate = (newStatus) => {
    onUpdate(investigation.id, { ...investigation, status: newStatus });
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{investigation.title}</h1>
              <Badge variant="outline" className={getStatusColor(investigation.status)}>
                {investigation.status}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(investigation.priority)}>
                {investigation.priority}
              </Badge>
            </div>
            <p className="text-gray-400">{investigation.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-700 text-gray-300">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            {investigation.status === 'active' && (
              <Button 
                onClick={() => handleStatusUpdate('paused')}
                variant="outline"
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
              >
                Pause
              </Button>
            )}
            {investigation.status === 'paused' && (
              <Button 
                onClick={() => handleStatusUpdate('active')}
                className="bg-green-600 hover:bg-green-700"
              >
                Resume
              </Button>
            )}
          </div>
        </div>

        {/* Investigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="entities" className="data-[state=active]:bg-gray-700 text-white">
              Target Entities
            </TabsTrigger>
            <TabsTrigger value="findings" className="data-[state=active]:bg-gray-700 text-white">
              Findings
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-700 text-white">
              Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Investigation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Created</p>
                      <p className="text-white font-medium">
                        {format(new Date(investigation.created_date), 'PPP')}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Created By</p>
                      <p className="text-white font-medium">{investigation.created_by}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Target Entities</p>
                      <p className="text-white font-medium">{investigation.target_entities?.length || 0}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Findings</p>
                      <p className="text-white font-medium">{investigation.findings?.length || 0}</p>
                    </div>
                  </div>

                  {investigation.compliance_notes && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <p className="text-gray-400 text-sm">Compliance Notes</p>
                      </div>
                      <p className="text-white text-sm leading-relaxed">{investigation.compliance_notes}</p>
                    </div>
                  )}

                  {investigation.tags && investigation.tags.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {investigation.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-purple-500 text-purple-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={createPageUrl("EntitySearch")} className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      Search New Entity
                    </Button>
                  </Link>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Finding
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 justify-start">
                    <Network className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entities">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Target Entities ({investigation.target_entities?.length || 0})
                </CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entity
                </Button>
              </CardHeader>
              <CardContent>
                {investigation.target_entities && investigation.target_entities.length > 0 ? (
                  <div className="grid gap-4">
                    {investigation.target_entities.map((entity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-white font-mono">{entity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={createPageUrl("EntitySearch")}>
                            <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                              <Eye className="w-4 h-4 mr-1" />
                              Analyze
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Target Entities</h3>
                    <p className="text-gray-400 mb-6">Add entities to begin your investigation</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Entity
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="findings">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Investigation Findings ({investigation.findings?.length || 0})
                </CardTitle>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Finding
                </Button>
              </CardHeader>
              <CardContent>
                {investigation.findings && investigation.findings.length > 0 ? (
                  <div className="space-y-4">
                    {investigation.findings.map((finding, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium">{finding.type}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.round(finding.confidence * 100)}% confidence
                            </Badge>
                            <span className="text-gray-400 text-xs">
                              {format(new Date(finding.timestamp), 'PPp')}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-700 p-3 rounded text-sm text-gray-300">
                          <pre>{JSON.stringify(finding.data, null, 2)}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Findings Yet</h3>
                    <p className="text-gray-400 mb-6">Document your investigation findings and evidence</p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Finding
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Investigation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Investigation Created</p>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(investigation.created_date), 'PPP p')}
                      </p>
                    </div>
                  </div>
                  
                  {investigation.findings && investigation.findings.map((finding, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white font-medium">Finding Added: {finding.type}</p>
                        <p className="text-gray-400 text-sm">
                          {format(new Date(finding.timestamp), 'PPP p')}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(!investigation.findings || investigation.findings.length === 0) && (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400">Investigation timeline will appear here as you add findings</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
