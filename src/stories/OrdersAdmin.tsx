import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  DataTable,
  Dialog,
  EmptyState,
  Select,
  Stepper,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  useToast
} from "../index";
import { orderColumns } from "./orderColumns";
import { orders as initialOrders, type Order, type OrderStatus } from "./sampleData";

const tabs: { value: string; label: string; match: (o: Order) => boolean }[] = [
  { value: "all", label: "All", match: () => true },
  { value: "open", label: "Needs action", match: (o) => o.status === "Pending" || o.status === "Failed" },
  { value: "shipped", label: "Shipped", match: (o) => o.status === "Shipped" },
  { value: "closed", label: "Closed", match: (o) => o.status === "Paid" || o.status === "Refunded" }
];

const steps = [
  { id: "customer", label: "Customer" },
  { id: "order", label: "Order" },
  { id: "review", label: "Review" }
];

function NewOrderDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (open: boolean) => void; onCreate: (order: Order) => void }) {
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState<OrderStatus>("Pending");
  const [notify, setNotify] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  const reset = () => {
    setStep(0);
    setCustomer("");
    setEmail("");
    setTotal("");
    setStatus("Pending");
    setNotify(true);
    setShowErrors(false);
  };

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) reset();
  };

  const customerError = showErrors && !customer.trim() ? "Enter the customer's company name" : undefined;
  const emailError = showErrors && !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email, like name@company.com" : undefined;
  const totalError = showErrors && !(Number(total) > 0) ? "Enter an amount greater than 0" : undefined;

  const next = () => {
    const invalid = step === 0 ? !customer.trim() || !/^\S+@\S+\.\S+$/.test(email) : step === 1 ? !(Number(total) > 0) : false;
    if (invalid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    onCreate({
      id: `A-${Math.floor(2000 + Math.random() * 7000)}`,
      customer: customer.trim(),
      email: email.trim(),
      total: Number(total),
      status,
      placedAt: new Date()
    });
    close(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={close}
      size="lg"
      title="New order"
      description="Create an order on behalf of a customer."
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="secondary" onClick={() => (step === 0 ? close(false) : setStep(step - 1))}>
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={next}>{step === steps.length - 1 ? "Create order" : "Continue"}</Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 24 }}>
        <Stepper steps={steps} currentStep={step} onStepClick={setStep} aria-label="New order progress" />
        {step === 0 && (
          <div style={{ display: "grid", gap: 16 }}>
            <TextField label="Company" required value={customer} onChange={(e) => setCustomer(e.target.value)} error={customerError} />
            <TextField
              label="Billing email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              description="Invoices are sent to this address."
              error={emailError}
            />
          </div>
        )}
        {step === 1 && (
          <div style={{ display: "grid", gap: 16 }}>
            <TextField
              label="Order total (USD)"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              required
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              error={totalError}
            />
            <Select
              label="Initial status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              options={["Pending", "Paid", "Shipped"].map((value) => ({ value, label: value }))}
            />
            <Checkbox label="Email the customer a confirmation" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          </div>
        )}
        {step === 2 && (
          <dl style={{ display: "grid", gridTemplateColumns: "10rem 1fr", gap: "8px 16px", margin: 0 }}>
            <dt style={{ color: "var(--fp-color-text-muted)" }}>Company</dt>
            <dd style={{ margin: 0 }}>{customer}</dd>
            <dt style={{ color: "var(--fp-color-text-muted)" }}>Billing email</dt>
            <dd style={{ margin: 0 }}>{email}</dd>
            <dt style={{ color: "var(--fp-color-text-muted)" }}>Total</dt>
            <dd style={{ margin: 0 }}>${Number(total).toFixed(2)}</dd>
            <dt style={{ color: "var(--fp-color-text-muted)" }}>Status</dt>
            <dd style={{ margin: 0 }}>{status}</dd>
            <dt style={{ color: "var(--fp-color-text-muted)" }}>Confirmation</dt>
            <dd style={{ margin: 0 }}>{notify ? "Will be emailed" : "Not sent"}</dd>
          </dl>
        )}
      </div>
    </Dialog>
  );
}

/** A realistic back-office screen built only from Flowpane components. Used by Storybook and the docs site. */
export function OrdersAdmin({ headingLevel = 1 }: { headingLevel?: 1 | 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  const counts = useMemo(() => Object.fromEntries(tabs.map((t) => [t.value, orders.filter(t.match).length])), [orders]);

  const markShipped = () => {
    const count = selected.length;
    setOrders((current) => current.map((o) => (selected.includes(o.id) ? { ...o, status: "Shipped" } : o)));
    setSelected([]);
    toast({ title: `${count} ${count === 1 ? "order" : "orders"} marked as shipped`, tone: "success" });
  };

  const cancelSelected = () => {
    const removed = orders.filter((o) => selected.includes(o.id));
    setOrders((current) => current.filter((o) => !selected.includes(o.id)));
    setSelected([]);
    setConfirmOpen(false);
    toast({
      title: `${removed.length} ${removed.length === 1 ? "order" : "orders"} cancelled`,
      tone: "danger",
      duration: 8000,
      action: (
        <Button size="sm" variant="secondary" onClick={() => setOrders((current) => [...removed, ...current])}>
          Undo
        </Button>
      )
    });
  };

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <Heading style={{ margin: 0, fontSize: "1.5rem" }}>Orders</Heading>
          <p style={{ margin: "4px 0 0", color: "var(--fp-color-text-muted)" }}>
            Review, ship, and follow up on customer orders.
          </p>
        </div>
        <Button onClick={() => setNewOrderOpen(true)}>New order</Button>
      </header>

      <Tabs value={tab} onValueChange={(value) => { setTab(value); setSelected([]); }}>
        <TabList aria-label="Order views">
          {tabs.map((t) => (
            <Tab key={t.value} value={t.value}>
              {t.label} ({counts[t.value]})
            </Tab>
          ))}
        </TabList>
        {tabs.map((t) => (
          <TabPanel key={t.value} value={t.value}>
            <DataTable
              data={orders.filter(t.match)}
              columns={orderColumns}
              getRowId={(o) => o.id}
              caption={`${t.label} orders`}
              hideCaption
              searchable
              searchPlaceholder="Search orders, customers, emails…"
              selectable
              selectedIds={selected}
              onSelectionChange={setSelected}
              getRowLabel={(o) => `Select order ${o.id}`}
              defaultSort={{ columnId: "placedAt", direction: "desc" }}
              pageSize={8}
              toolbar={({ selectedIds }) =>
                selectedIds.length > 0 && (
                  <>
                    <Button size="sm" variant="secondary" onClick={markShipped}>
                      Mark as shipped
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setConfirmOpen(true)}>
                      Cancel orders
                    </Button>
                  </>
                )
              }
              emptyState={
                <EmptyState
                  title="Nothing in this view"
                  description="Orders that match this view will show up here."
                  action={<Button variant="secondary" onClick={() => setTab("all")}>View all orders</Button>}
                />
              }
            />
          </TabPanel>
        ))}
      </Tabs>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        role="alertdialog"
        size="sm"
        title={`Cancel ${selected.length} ${selected.length === 1 ? "order" : "orders"}?`}
        description="Customers will be notified and any payments refunded."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Keep orders
            </Button>
            <Button variant="danger" onClick={cancelSelected}>
              Cancel orders
            </Button>
          </>
        }
      />

      <NewOrderDialog
        open={newOrderOpen}
        onOpenChange={setNewOrderOpen}
        onCreate={(order) => {
          setOrders((current) => [order, ...current]);
          setTab("all");
          toast({ title: `Order ${order.id} created`, description: `${order.customer} · $${order.total.toFixed(2)}`, tone: "success" });
        }}
      />
    </div>
  );
}
