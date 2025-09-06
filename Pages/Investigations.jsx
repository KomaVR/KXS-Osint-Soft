import React, { useState, useEffect } from "react";
import { Investigation } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Clock,
  AlertTriangle,
  Eye,
  Archive,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import InvestigationForm from "../components/investigations/InvestigationForm";
import InvestigationDetails from "../components/investigations/InvestigationDetails";

export default function Investigations() {
  const [investigations, setInvestigations] = useState([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadInvestigations();
  }, []);

  const loadInvestigations = async () => {
    const data = await Investigation.list('-created_date');
    setInvestigations(data);
  };

  const handleCreateInvestigation = async (data) => {
    await Investigation.create(data);
    setShowForm(false);
    loadInvestigations();
  };

  const handleUpdateInvestigation = async (id, data) => {
    await Investigation.update(id, data);
    loadInvestigations();
    setSelectedInvestigation(null);
  };

  const filteredInvestigations = investigations.filter(inv => {
    const matchesSearch = inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-500';
      case 'paused': return 'text-yellow-400 border-yellow-500';
      case 'completed': return 'text-blue-400 border-blue-500';
      case 'archived': return 'text-gray-400 border-gray-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 border-red-500';
      case 'high': return 'text-orange-400 border-orange-500';
      case 'medium': return 'text-yellow-400 border-yellow-500';
      case 'low': return 'text-green-400 border-green-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  if (selectedInvestigation) {
    return (
      <InvestigationDetails
        investigation={selectedInvestigation}
        onBack={() => setSelectedInvestigation(null)}
        onUpdate={handleUpdateInvestigation}
      />
    );
  }

  if (showForm) {
    return (
      <InvestigationForm
        onSubmit={handleCreateInvestigation}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Investigations</h1>
            <p className="text-gray-400">Manage your active intelligence operations</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Investigation
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search investigations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'active', 'paused', 'completed', 'archived'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? "bg-blue-600" : "text-gray-400 hover:text-white"}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Cases</p>
                  <p className="text-2xl font-bold text-green-400">
                    {investigations.filter(i => i.status === 'active').length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">High Priority</p>
                  <p className="text-2xl font-bold text-red-400">
                    {investigations.filter(i => i.priority === 'high' || i.priority === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {investigations.filter(i => i.status === 'completed').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Archived</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {investigations.filter(i => i.status === 'archived').length}
                  </p>
                </div>
                <Archive className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investigations List */}
        <div className="grid gap-4">
          {filteredInvestigations.map((investigation, index) => (
            <motion.div
              key={investigation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedInvestigation(investigation)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{investigation.title}</h3>
                      <p className="text-gray-400 text-sm">{investigation.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className={getStatusColor(investigation.status)}>
                        {investigation.status}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(investigation.priority)}>
                        {investigation.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Created {format(new Date(investigation.created_date), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {investigation.target_entities?.length || 0} targets
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {investigation.findings?.length || 0} findings
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      View Details
                    </Button>
                  </div>

                  {investigation.target_entities && investigation.target_entities.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-gray-400 text-sm mb-2">Target Entities:</p>
                      <div className="flex flex-wrap gap-2">
                        {investigation.target_entities.slice(0, 3).map((entity, i) => (
                          <Badge key={i} variant="secondary" className="bg-gray-800 text-gray-300">
                            {entity}
                          </Badge>
                        ))}
                        {investigation.target_entities.length > 3 && (
                          <Badge variant="secondary" className="bg-gray-800 text-gray-400">
                            +{investigation.target_entities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredInvestigations.length === 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Investigations Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No investigations match your current filters.'
                    : 'Start your first intelligence investigation to track your OSINT operations.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Investigation
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
