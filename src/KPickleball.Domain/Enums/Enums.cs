namespace KPickleball.Domain.Enums;

public enum UserRole
{
    Member = 0,
    Admin = 1
}

public enum PlayerLevel
{
    Beginner = 0,    // 2.0~2.5
    Novice = 1,      // 3.0
    Intermediate = 2, // 3.5
    Advanced = 3,    // 4.0
    Expert = 4       // 4.5+
}
public enum BoardCategory
{
    Notice = 0,
    Free = 1,
    Tournament = 2,
    Marketplace = 3,
    Court = 4
}
public enum VideoCategory
{
    Lesson = 0,       // 레슨
    Match = 1,        // 경기
    Highlight = 2,    // 하이라이트
    Tips = 3          // 팁/전략
}

public enum ClubMemberRole
{
    Member = 0,
    Manager = 1,
    Owner = 2
}

public enum ClubMemberStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Banned = 3
}

public enum TournamentStatus
{
    Upcoming = 0,
    RegistrationOpen = 1,
    RegistrationClosed = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5
}

public enum EntryStatus
{
    Pending = 0,
    Confirmed = 1,
    Cancelled = 2,
    Waitlisted = 3
}
public enum MemberStatus
{
    Pending = 0,    // 가입 신청 (승인 대기)
    Approved = 1,   // 정회원 (승인 완료)
    Rejected = 2    // 거절
}