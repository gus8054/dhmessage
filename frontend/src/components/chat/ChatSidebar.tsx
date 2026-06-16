import { UserButton } from "@clerk/react";
import {
  getInitials,
  useSelectedConversation,
} from "../../hooks/useSelectedConversation";
import { useAuthStore, type User } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { APP_NAME, AppLogo } from "../AppLogo";
import { SearchField, Tabs } from "@heroui/react";
import { MessageSquareIcon, UsersIcon } from "lucide-react";
import { ConversationRow } from "./ConversationRow";

// 1. 리스트(UI)에서 사용하기 위해 가공된 유저 데이터의 타입을 정의합니다.
// 이 타입은 나중에 ConversationRow 컴포넌트의 props 타입을 정의할 때도 유용하게 쓰입니다.
export interface MappedConversationUser {
  conversationId: string;
  id: string;
  name: string;
  avatarUrl: string;
  initials: string;
  isOnline: boolean;
  peer: {
    name: string;
    avatarUrl: string;
    initials: string;
    isOnline: boolean;
  };
}

// 3. 파라미터와 반환 타입을 명확히 지정하여 가공 함수의 안전성을 높입니다.
function mapUserForList(
  user: User,
  onlineUsers: string[],
): MappedConversationUser {
  const safeName = user.fullName || "Unknown";
  const safeAvatarUrl = user.profilePic || "";
  return {
    conversationId: user._id,
    id: user._id,
    name: safeName,
    avatarUrl: safeAvatarUrl,
    initials: getInitials(safeName), // 이제 safeName은 무조건 string이므로 안전합니다.
    isOnline: onlineUsers.includes(user._id),
    peer: {
      name: safeName,
      avatarUrl: safeAvatarUrl,
      initials: getInitials(safeName),
      isOnline: onlineUsers.includes(user._id),
    },
  };
}

function ChatSidebar() {
  // 스토어에서 가져오는 데이터들은 이전에 설정한 Store 타입 정의에 의해 자동 추론됩니다.
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);

  const searchQuery = useChatStore((state) => state.searchQuery);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);

  const sidebarTab = useChatStore((state) => state.sidebarTab);
  const setSidebarTab = useChatStore((state) => state.setSidebarTab);

  const setActiveConversationId = useChatStore(
    (state) => state.setActiveConversationId,
  );

  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  const { activeConversationId, isLargeScreen } = useSelectedConversation();

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  // mapUserForList의 반환 타입 덕분에 아래 배열들은 MappedConversationUser[] 로 완벽히 추론됩니다.
  const conversationUsers = conversations.map((user) =>
    mapUserForList(user, onlineUsers),
  );
  const allUsers = users.map((user) => mapUserForList(user, onlineUsers));

  const filteredConversations = normalizedSearchQuery
    ? conversationUsers.filter((conversation) =>
        conversation.peer.name.toLowerCase().includes(normalizedSearchQuery),
      )
    : conversationUsers;

  const filteredUsers = normalizedSearchQuery
    ? allUsers.filter((user) =>
        user.name.toLowerCase().includes(normalizedSearchQuery),
      )
    : allUsers;

  return (
    <aside
      className={`w-full shrink-0 flex-col overflow-hidden border-r border-border lg:w-72 ${
        !isLargeScreen && activeConversationId ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="shrink-0 border-b border-border px-2 pb-2 pt-2.5 sm:px-3 sm:pt-3">
        <div className="flex items-center gap-2 px-0.5 sm:gap-2.5 sm:px-1">
          <AppLogo
            size={32}
            className="size-8 shrink-0 rounded-[9px] sm:size-8.5"
            alt=""
          />
          <p className="flex-1 truncate text-lg font-bold tracking-tight sm:text-[22px]">
            {APP_NAME}
          </p>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
        </div>
      </div>
      <Tabs
        selectedKey={sidebarTab}
        onSelectionChange={(key) => setSidebarTab(String(key))}
        variant="secondary"
        className="flex flex-1 flex-col overflow-y-auto"
      >
        <div className="shrink-0 border-b border-border px-3 pb-2 pt-2">
          <SearchField
            fullWidth
            variant="secondary"
            className="w-full"
            value={searchQuery}
            onChange={setSearchQuery}
          >
            <SearchField.Group className="rounded-xl">
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search" />
              {searchQuery ? <SearchField.ClearButton /> : null}
            </SearchField.Group>
          </SearchField>
        </div>

        <Tabs.ListContainer className="shrink-0 border-b border-border px-2 pb-2 pt-1">
          <Tabs.List className="w-full gap-0.5">
            <Tabs.Tab id="chats" className="flex-1 justify-center gap-1.5">
              <MessageSquareIcon className="size-3.5 opacity-80" aria-hidden />
              Chats
            </Tabs.Tab>
            <Tabs.Tab id="users" className="flex-1 justify-center gap-1.5">
              <UsersIcon className="size-3.5 opacity-80" aria-hidden />
              Users
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel
          id="chats"
          className="flex-1 overflow-x-hidden overflow-y-auto outline-none"
        >
          {filteredConversations.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">
              No conversations match your search.
            </p>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                user={conversation}
                selected={conversation.id === activeConversationId}
                onSelect={() => setActiveConversationId(conversation.id)}
              />
            ))
          )}
        </Tabs.Panel>

        <Tabs.Panel
          id="users"
          className="flex-1 overflow-x-hidden overflow-y-auto outline-none"
        >
          {filteredUsers.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">
              No people match your search.
            </p>
          ) : (
            filteredUsers.map((user) => (
              <ConversationRow
                key={user.conversationId}
                user={user}
                selected={user.conversationId === activeConversationId}
                onSelect={() => setActiveConversationId(user.conversationId)}
              />
            ))
          )}
        </Tabs.Panel>
      </Tabs>
    </aside>
  );
}

export default ChatSidebar;
