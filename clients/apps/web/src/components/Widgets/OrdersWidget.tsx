import { useOrders } from '@/hooks/queries/orders'
import { OrganizationContext } from '@/providers/maintainerOrganization'
import { ShoppingCartOutlined } from '@mui/icons-material'
import { schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@polar-sh/ui/components/atoms/Card'
import { formatCurrencyAndAmount } from '@polar-sh/ui/lib/money'
import Link from 'next/link'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'

interface OrderCardProps {
  className?: string
  order: schemas['Order']
}

const OrderCard = ({ className, order }: OrderCardProps) => {
  const createdAtDate = new Date(order.created_at)

  const displayDate = createdAtDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <Card
      className={twMerge(
        className,
        'dark:bg-polar-900 dark:hover:bg-polar-700 flex flex-col gap-y-1 rounded-2xl border-none bg-white transition-colors hover:bg-gray-200',
      )}
    >
      <CardHeader className="dark:text-polar-500 flex flex-row items-baseline justify-between bg-transparent p-4 pb-0 text-sm text-gray-400">
        <span>{displayDate}</span>
      </CardHeader>
      <CardContent className="flex flex-row justify-between gap-x-4 p-4 pt-0">
        <h3 className="min-w-0 truncate">{order.product.name}</h3>
        <span className="dark:text-polar-500 text-gray-400">
          {formatCurrencyAndAmount(order.net_amount, order.currency, 0)}
        </span>
      </CardContent>
    </Card>
  )
}

export interface OrdersWidgetProps {
  className?: string
}

export const OrdersWidget = ({ className }: OrdersWidgetProps) => {
  const { organization: org } = useContext(OrganizationContext)

  const orders = useOrders(org.id, { limit: 10, sorting: ['-created_at'] })

  return (
    <div
      className={twMerge(
        'dark:bg-polar-800 rounded-4xl relative h-full bg-gray-50',
        className,
      )}
    >
      {(orders.data?.items.length ?? 0) > 0 ? (
        <div className="absolute inset-2 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <h3 className="text-lg">Latest Orders</h3>
            <Link href={`/dashboard/${org.slug}/sales`}>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full border-none"
              >
                View All
              </Button>
            </Link>
          </div>
          <div className="rounded-b-4xl flex h-full flex-col gap-y-2 overflow-y-auto rounded-t-2xl pb-4">
            {orders.data?.items?.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/${org.slug}/sales/${order.id}`}
              >
                <OrderCard order={order} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Card className="dark:text-polar-500 flex h-full flex-col items-center justify-center gap-y-6 bg-gray-50 p-6 text-gray-400">
          <ShoppingCartOutlined
            className="dark:text-polar-600 text-gray-300"
            fontSize="large"
          />
          <h3>No orders found</h3>
        </Card>
      )}
    </div>
  )
}
