'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransactions, useWalletBalance, useWithdrawals } from '@/lib/queries';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';


const withdrawSchema = z.object({
  amount: z.number().min(100, 'Minimum withdrawal amount is $100').max(50000, 'Maximum withdrawal amount is $50,000'),
  bankAccount: z.string().min(1, 'Please select a bank account'),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions({ limit: 50 });
  const { data: withdrawals, isLoading: withdrawalsLoading } = useWithdrawals();

  const withdrawForm = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
      bankAccount: '',
    },
  });

  const handleWithdraw = async (data: WithdrawForm) => {
    try {
      // Call withdrawal API
      toast.success('Withdrawal request submitted', {
        description: `Amount: $${data.amount.toLocaleString()}, expected to arrive in 1-3 business days`,
      });
      setIsWithdrawDialogOpen(false);
      withdrawForm.reset();
    } catch (error) {
      toast.error('Withdrawal failed, please try again later');
    }
  };

  const stats = [
    {
      title: 'Total Balance',
      value: balance?.available || 0,
      icon: Wallet,
      change: '+12.5%',
      trend: 'up',
      prefix: '$',
    },
    {
      title: 'Monthly Income',
      value: balance?.pending || 0,
      icon: TrendingUp,
      change: '+8.2%',
      trend: 'up',
      prefix: '$',
    },
    {
      title: 'Withdrawn',
      value: (balance as any)?.withdrawn || 0,
      icon: CreditCard,
      change: '-3.1%',
      trend: 'down',
      prefix: '$',
    },
    {
      title: 'Pending',
      value: balance?.pending || 0,
      icon: DollarSign,
      change: '0%',
      trend: 'neutral',
      prefix: '$',
    },
  ];

  const recentTransactions = transactions?.slice(0, 10) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
        {/* Page Title */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Finance</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Manage your income, transactions, and withdrawals</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium truncate">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-lg sm:text-2xl font-bold">
                  {stat.prefix}{stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />}
                  {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />}
                  <span className={stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : ''}>
                    {stat.change}
                  </span>
                  <span className="hidden sm:inline"> vs last month</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="banking">Bank Accounts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-7">
              {/* Income Trend Chart */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Income Trend</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Income over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                    Income Trend Chart Area (Chart Library Integration)
                  </div>
                </CardContent>
              </Card>

              {/* Withdraw Action */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Quick Withdraw</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Withdraw balance to bank account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Available Balance</Label>
                    <div className="text-3xl font-bold">${balance?.available?.toLocaleString() || '0'}</div>
                  </div>
                  
                  <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={!balance?.available}>
                        <Wallet className="h-4 w-4 mr-2" />
                        Request Withdrawal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Withdrawal</DialogTitle>
                        <DialogDescription>
                          Please fill in the following information to request a withdrawal
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={withdrawForm.handleSubmit(handleWithdraw)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter withdrawal amount"
                            {...withdrawForm.register('amount', { valueAsNumber: true })}
                          />
                          {withdrawForm.formState.errors.amount && (
                            <p className="text-sm text-red-500">{withdrawForm.formState.errors.amount.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankAccount">Bank Account</Label>
                          <Select 
                            onValueChange={(value) => withdrawForm.setValue('bankAccount', value)}
                            value={withdrawForm.watch('bankAccount')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select bank account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank1">Bank of America ****1234</SelectItem>
                              <SelectItem value="bank2">Chase Bank ****5678</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="rounded-lg bg-muted p-3 text-sm">
                          <div className="flex justify-between mb-2">
                            <span>Withdrawal Amount</span>
                            <span className="font-medium">${withdrawForm.watch('amount')?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span>Fee</span>
                            <span className="font-medium">$0</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Actual Amount</span>
                            <span className="font-bold text-primary">${withdrawForm.watch('amount')?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={!withdrawForm.watch('amount')}>
                            Confirm Withdrawal
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-2">
                    <Label>Withdrawal Progress</Label>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground">Withdrawn this month $15,000 / $50,000</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>View recent income and expenses</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('transactions')}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.slice(0, 5).map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.type === 'income' ? (
                                <ArrowDownRight className="h-4 w-4" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4" />
                              )}
                            </div>
                            <span className="font-medium">
                              {transaction.type === 'income' ? 'Income' : 'Expense'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className={transaction.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {transaction.status === 'completed' ? 'Completed' : 
                             transaction.status === 'pending' ? 'Processing' : 'Cancelled'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(transaction.createdAt), 'yyyy-MM-dd HH:mm', { locale: enUS })}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{transaction.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>View all income and expense details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Processing</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : recentTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentTransactions.map((transaction: any) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-full ${
                                transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {transaction.type === 'income' ? (
                                  <ArrowDownRight className="h-4 w-4" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4" />
                                )}
                              </div>
                              <span className="font-medium">
                                {transaction.type === 'income' ? 'Income' : 'Expense'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className={transaction.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              transaction.status === 'completed' ? 'default' :
                              transaction.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {transaction.status === 'completed' ? 'Completed' : 
                               transaction.status === 'pending' ? 'Processing' : 'Failed'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(transaction.createdAt), 'yyyy-MM-dd HH:mm', { locale: enUS })}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{transaction.description}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Details</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
                <CardDescription>View withdrawal history and status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bank Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Arrival Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : !withdrawals || withdrawals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No withdrawals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      withdrawals.map((withdrawal: any) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell>
                            {format(new Date(withdrawal.createdAt), 'yyyy-MM-dd HH:mm', { locale: enUS })}
                          </TableCell>
                          <TableCell className="font-medium">${withdrawal.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {withdrawal.bankName} ****{withdrawal.accountLast4}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              withdrawal.status === 'completed' ? 'default' :
                              withdrawal.status === 'processing' ? 'secondary' : 
                              withdrawal.status === 'failed' ? 'destructive' : 'outline'
                            }>
                              {withdrawal.status === 'completed' ? 'Arrived' : 
                               withdrawal.status === 'processing' ? 'Processing' : 
                               withdrawal.status === 'failed' ? 'Failed' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {withdrawal.completedAt ? 
                              format(new Date(withdrawal.completedAt), 'yyyy-MM-dd HH:mm', { locale: enUS }) : '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Linked Bank Accounts</CardTitle>
                  <CardDescription>Manage your bank accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold">BOA</span>
                        </div>
                        <div>
                          <p className="font-medium">Bank of America</p>
                          <p className="text-sm text-muted-foreground">****1234</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Default</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Set as Default</Button>
                      <Button variant="outline" size="sm">Unbind</Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Bank Account
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Protect your financial security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Payment Password</p>
                        <p className="text-sm text-muted-foreground">Set</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Change</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Withdrawal Limit</p>
                        <p className="text-sm text-muted-foreground">Remaining this month $35,000</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}
