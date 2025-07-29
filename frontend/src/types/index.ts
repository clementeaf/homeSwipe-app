// Types Index - Centralización de todas las interfaces
// Siguiendo principios MCP: Model - Estructura de datos centralizada

// ===== ERROR HANDLING TYPES =====
export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo?: any;
}

export interface UseErrorHandlerReturn {
  errorState: ErrorState;
  handleError: (error: Error, errorInfo?: any) => void;
  clearError: () => void;
  resetError: () => void;
}

// ===== API TYPES =====
export interface APIRoute {
  path: string;
  method: string;
  description: string;
  example: string;
}

export interface APIResponse<T = any> {
  message?: string;
  timestamp?: string;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface UserFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface UsersResponse extends APIResponse {
  users: User[];
  total: number;
}

export interface SingleUserResponse {
  user: User;
  message?: string;
}

export interface StatusResponse extends APIResponse {
  status: string;
}

export interface HealthResponse extends APIResponse {
  status: string;
}

export interface DiscoveryResponse extends APIResponse {
  version: string;
  baseUrl: string;
  routes: Record<string, {
    path: string;
    method: string;
    description: string;
    example: string;
  }>;
  environment: string;
  region: string;
  deployment: {
    timestamp: string;
    version: string;
  };
}

export interface APIDiscovery {
  message: string;
  timestamp: string;
  version: string;
  baseUrl: string;
  routes: {
    [key: string]: APIRoute;
  };
  environment: string;
  region: string;
  deployment: {
    timestamp: string;
    version: string;
  };
}

// ===== COMPONENT PROPS TYPES =====
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKey?: string | number;
}

export interface ErrorDisplayProps {
  error: Error | null;
  errorInfo?: any;
  onRetry?: () => void;
  onReset?: () => void;
  variant?: 'default' | 'compact' | 'inline';
  showDetails?: boolean;
  className?: string;
}

// ===== HTTP CLIENT TYPES =====
export interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

// ===== UTILITY TYPES =====
export type AsyncFunction<T> = () => Promise<T>;

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: Record<string, 'asc' | 'desc'>;
}

// ===== ENVIRONMENT TYPES =====
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  APP_NAME: string;
  VERSION: string;
}

// ===== EVENT TYPES =====
export interface ErrorEvent {
  type: 'error';
  error: Error;
  context?: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
}

export interface LogEvent {
  type: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp: number;
  context?: string;
}

// ===== VALIDATION TYPES =====
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ===== STATE MANAGEMENT TYPES =====
export interface AppState {
  isLoading: boolean;
  error: Error | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface Action<T = any> {
  type: string;
  payload?: T;
  error?: Error;
}

// ===== ROUTING TYPES =====
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
}

// ===== SIDEBAR TYPES =====
export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  children?: SidebarItem[];
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'error';
  };
}

export interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  items: SidebarItem[];
  className?: string;
  variant?: 'default' | 'compact' | 'overlay';
  position?: 'left' | 'right';
  width?: string;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  onItemClick?: (item: SidebarItem) => void;
  showActiveIndicator?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface SidebarItemProps {
  item: SidebarItem;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: (item: SidebarItem) => void;
  className?: string;
  level?: number;
}

// ===== NAVIGATION TYPES =====
export interface NavigationItem extends SidebarItem {
  route?: string;
  permissions?: string[];
  roles?: string[];
  external?: boolean;
}

export interface NavigationState {
  currentRoute: string;
  previousRoute?: string;
  params?: Record<string, any>;
  breadcrumbs?: NavigationItem[];
}

// ===== THEME TYPES =====
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  borderRadius: number;
  fontSize: {
    small: string;
    base: string;
    large: string;
    xlarge: string;
  };
}

// ===== NOTIFICATION TYPES =====
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
}

// ===== FORM TYPES =====
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => ValidationResult;
  };
  options?: Array<{ value: string; label: string }>;
}

export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

// ===== API HOOKS TYPES =====
export interface UseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  retryDelay?: number;
  staleTime?: number;
  gcTime?: number;
}

export interface UseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

// ===== CACHE TYPES =====
export interface CacheConfig {
  maxSize: number;
  ttl: number;
  strategy: 'lru' | 'fifo' | 'lfu';
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
}

// ===== PERFORMANCE TYPES =====
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, any>;
}

export interface PerformanceMonitor {
  metrics: PerformanceMetric[];
  thresholds: Record<string, number>;
  alerts: PerformanceAlert[];
}

export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
}

// MatchCard Types
export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  matchPercentage: number;
  views: number;
  likes: number;
  images: PropertyImage[];
}

export interface ActionButton {
  id: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export interface MatchCardProps {
  property: Property;
  onReject: (propertyId: string) => void;
  onLike: (propertyId: string) => void;
  onView: (propertyId: string) => void;
  onAccept: (propertyId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalProperties: number;
} 