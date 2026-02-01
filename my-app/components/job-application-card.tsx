"use client"
import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";


interface JobApplicationCardProps {
    job: JobApplication;
    columns: Column[];
}

export default function JobApplicationCard({job, columns}: JobApplicationCardProps) {
    console.log("Rendering JobApplicationCard:", job);
    
    return (
        <>
            <Card className="bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">{job.position}</h3>
                            <p className="text-xs text-gray-600 truncate">{job.company}</p>
                            {job.description && (
                                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                            )}
                            {job.tags && job.tags.length >0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {job.tags.map((tag, index) => (
                                        <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{tag}</span>
                                    ))}
                                </div>
                            ) }
                            {job.jobUrl && (
                                <a target="_blank" href={job.jobUrl} onClick={(e)=> e.stopPropagation()} className="inline-flex mt-2">
                                    <ExternalLink className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                                </a>
                            )}
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MoreVertical className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit2 className="mr-2 h-4 w-4"/>
                                        Edit
                                    </DropdownMenuItem>
                                    {columns.length > 1 && (
                                        <>
                                            {columns.filter((c) => c._id !== job.columnId).map((column, index) => (
                                                <DropdownMenuItem key={index}>
                                                    Move to {column.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </>
                                    )}

                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4"/>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}