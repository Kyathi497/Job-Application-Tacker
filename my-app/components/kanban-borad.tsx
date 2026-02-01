"use client"

import { Board, Column, JobApplication } from "@/lib/models/models.types"
import { Award, Calendar, CheckCircle2, Mic, MoreVertical, Trash2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";


interface KanbanBoardProps {
    board: Board;
    userId: string;
};

interface ColConfig {
    color: string; icon: React.ReactNode
}

const COLUMN_CONFIG: Array<ColConfig> = [
    {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
];

function DroppableColumn({column, config, boardId, sortedColumns}: {column: Column; config:ColConfig; boardId: string; sortedColumns: Column[] }) {

    const sortedJobs = column.jobApplications?.sort((a,b) => a.order-b.order) || [];
    return (
        <Card className="min-w-[300px] flex-shrink-0 shadow-md p-0">
            <CardHeader className={`${config.color} text-white rounded-t-lg pd-3 pt-3`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className="text-white text-base font-semibold"
                        >{column.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white hover:bg-white/20"
                                >
                                <MoreVertical className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4"/>
                                Delete Column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>\

            <CardContent className={`space-y-2 pt-4 bg-gray-50/50 min-h-[400px] rounded-b-lg `}>

                {sortedJobs.map((job, index)=> (
                    <SortableJobCard 
                        key={index} 
                        job={{...job, columnId: job.columnId || column._id}}
                        columns={sortedColumns}
                                />
                ))}

                <CreateJobApplicationDialog columnId={column._id} boardId={boardId}/>
            </CardContent>
        </Card>
    )

}

function SortableJobCard({job, columns}: {job: JobApplication; columns: Column[]}) {
    console.log("Rendering SortableJobCard:", job);
    
    return (
        <div className="mb-2">
            <JobApplicationCard job={job} columns={columns}/>
        </div>
    )
}

export default function KanbanBoard({board, userId}: KanbanBoardProps) {
    if (!board || !board.columns) {
        console.log("No board or columns found");
        return <div>No board data available</div>;
    }

    const columns = board.columns;
    console.log("Board loaded:", board);
    console.log("Columns:", columns);
    console.log("First column job applications:", columns[0]?.jobApplications);
    
    const sortedColumns = columns?.sort((a,b) => a.order-b.order) || [];

    return (
        <>
            <div className="w-full overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max px-4">
                    {columns.map((col, index) => {
                        const config = COLUMN_CONFIG[index] || {
                            color: "bg-gray-500",
                            icon: <Calendar className="h-4 w-4"/>
                        };
                        return (
                            <DroppableColumn
                                key={index}
                                column={col}
                                config={config}
                                boardId={board._id}
                                sortedColumns={sortedColumns}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}