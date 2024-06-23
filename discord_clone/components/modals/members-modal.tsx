"use client";

import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { MemberRole } from "@prisma/client";
import qs from "query-string";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { UserAvatar } from "@/components/user-avatar";
import axios from "axios";


const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

export const MembersModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState("");

    const { server } = data as { server: ServerWithMembersWithProfiles };
    const isModalOpen = isOpen && type === "members";

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    memberId
                }
            })

            const response = await axios.patch(url, { role });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription
                    className="text-center text-zinc-500 "
                    >
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea
                 className="mt-8 max-h-[420px] pr-6"
                >
                    {server?.members?.map((member) => (
                        <div key={member?.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member?.profile?.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center ">
                                    {member?.profile?.name}
                                    {roleIconMap[member?.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member?.profile?.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="focus:outline-none focus:ring-transparent">
                                            <MoreVertical className="h-4 w-4 text-zinc-500 focus:outline-none focus:ring-transparent" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger
                                                 className="flex items-center"
                                                >
                                                    <ShieldQuestion
                                                     className="h-4 w-4 mr-2"
                                                    />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        {/* To check for guest */}
                                                        <DropdownMenuItem>
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Guest
                                                            {member?.role === "GUEST" && (
                                                                <Check  className="h-4 w-4 ml-auto"/>
                                                            )}
                                                        </DropdownMenuItem>
                                                        {/* To check for Moderator  */}
                                                        <DropdownMenuItem>
                                                            <ShieldCheck className="h-4 w-4 mr-2" />
                                                            Moderator
                                                            {member?.role === "MODERATOR" && (
                                                                <Check  className="h-4 w-4 ml-auto"/>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Gavel className="h-4 w-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
     );
}
 
